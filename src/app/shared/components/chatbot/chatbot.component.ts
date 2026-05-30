import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, Event } from '@angular/router';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatbotNode } from '../../../core/models/chatbot.models';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  options?: ChatbotNode[];
  routeUrl?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  isOpen = false;
  isMinimized = false;
  isVisible = true;

  history: Message[] = [];
  rootNodes: ChatbotNode[] = [];
  currentOptions: ChatbotNode[] = [];
  navigationStack: ChatbotNode[] = [];
  searchQuery = '';

  private routerSubscription!: Subscription;

  constructor(
    private chatbotService: ChatbotService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRootNodes();
    this.checkVisibility(this.router.url);

    // Track route changes to hide/show widget on appropriate pages if needed
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkVisibility(event.urlAfterRedirects);
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  checkVisibility(url: string) {
    // Show on:
    // - Home Page ('/' or empty)
    // - Login ('/login')
    // - Register ('/register')
    // - Candidate Dashboard ('/candidate/dashboard')
    // - Recruiter Dashboard ('/recruiter/dashboard')
    // As per requirement, but to ensure it is extremely helpful, we will keep it visible on those specified, and general public pages too!
    const normalizedUrl = url.split('?')[0]; // strip query params
    
    const allowedPages = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/candidate/dashboard',
      '/recruiter/dashboard',
      '/candidate/profile',
      '/candidate/applications',
      '/candidate/jobs',
      '/recruiter/post-job',
      '/recruiter/applicants',
      '/recruiter/profile',
      '/jobs',
      '/companies',
      '/feed'
    ];
    
    // We make sure it is shown on those pages.
    this.isVisible = allowedPages.some(page => normalizedUrl === page || normalizedUrl.startsWith(page));
  }

  loadRootNodes() {
    this.chatbotService.getRootNodes().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rootNodes = res.data;
          this.currentOptions = res.data;
          this.initializeWelcome();
        }
      },
      error: (err) => {
        console.error('Failed to load chatbot main menu:', err);
      }
    });
  }

  initializeWelcome() {
    this.history = [
      {
        sender: 'bot',
        text: '👋 Welcome to TalEx Assistant.\nHow can I help you today?',
        options: this.rootNodes,
        timestamp: new Date()
      }
    ];
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isMinimized = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  minimizeChat(event: MouseEvent) {
    event.stopPropagation();
    this.isMinimized = !this.isMinimized;
  }

  closeChat(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = false;
    this.isMinimized = false;
  }

  selectOption(node: ChatbotNode) {
    // Add user click representation in chat
    this.history.push({
      sender: 'user',
      text: node.title,
      timestamp: new Date()
    });

    if (node.routeUrl) {
      // Check if user is trying to access a restricted dashboard/job action page without being logged in
      const isRestricted = node.routeUrl.startsWith('/candidate') || 
                           node.routeUrl.startsWith('/recruiter') || 
                           node.routeUrl.startsWith('/admin') ||
                           node.routeUrl.startsWith('/feed');

      if (isRestricted && !this.authService.isLoggedIn()) {
        this.history.push({
          sender: 'bot',
          text: `⚠️ Please log in first to access "${node.title}". Redirecting you to the Login page...`,
          routeUrl: '/login',
          timestamp: new Date()
        });
        this.scrollToBottom();
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        return;
      }

      // Show page message and button
      this.history.push({
        sender: 'bot',
        text: node.message,
        routeUrl: node.routeUrl,
        timestamp: new Date()
      });
      this.scrollToBottom();

      // Automatically navigate as well!
      setTimeout(() => {
        this.router.navigate([node.routeUrl]);
      }, 1500);
      return;
    }

    // Otherwise load children
    this.chatbotService.getChildNodes(node.id).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.length > 0) {
          this.navigationStack.push(node);
          this.currentOptions = res.data;
          this.history.push({
            sender: 'bot',
            text: node.message,
            options: res.data,
            timestamp: new Date()
          });
        } else {
          this.history.push({
            sender: 'bot',
            text: node.message,
            timestamp: new Date()
          });
        }
        this.scrollToBottom();
      },
      error: () => {
        this.history.push({
          sender: 'bot',
          text: node.message,
          timestamp: new Date()
        });
        this.scrollToBottom();
      }
    });
  }

  goBack() {
    if (this.navigationStack.length > 0) {
      // Pop last parent
      this.navigationStack.pop();
      
      // If there is still a parent, load its children, else load root menu
      if (this.navigationStack.length > 0) {
        const parent = this.navigationStack[this.navigationStack.length - 1];
        this.chatbotService.getChildNodes(parent.id).subscribe({
          next: (res) => {
            if (res.success && res.data) {
              this.currentOptions = res.data;
              this.history.push({
                sender: 'bot',
                text: `Returned to "${parent.title}". How else can I help?`,
                options: res.data,
                timestamp: new Date()
              });
              this.scrollToBottom();
            }
          }
        });
      } else {
        this.currentOptions = this.rootNodes;
        this.history.push({
          sender: 'bot',
          text: 'Returned to Main Menu. Select a topic below:',
          options: this.rootNodes,
          timestamp: new Date()
        });
        this.scrollToBottom();
      }
    }
  }

  submitSearch() {
    if (!this.searchQuery || !this.searchQuery.trim()) return;

    const query = this.searchQuery.trim();
    this.searchQuery = '';

    // Add user query to chat history
    this.history.push({
      sender: 'user',
      text: query,
      timestamp: new Date()
    });

    this.chatbotService.searchKeyword(query).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const node = res.data;
          
          // Find if this matched node has children options
          this.chatbotService.getChildNodes(node.id).subscribe({
            next: (childRes) => {
              const childOptions = (childRes.success && childRes.data) ? childRes.data : [];
              
              this.history.push({
                sender: 'bot',
                text: node.message,
                options: childOptions.length > 0 ? childOptions : undefined,
                routeUrl: node.routeUrl || undefined,
                timestamp: new Date()
              });

              if (childOptions.length > 0) {
                this.currentOptions = childOptions;
                this.navigationStack = [node]; // Set stack to the matched node
              }

              this.scrollToBottom();

              if (node.routeUrl) {
                const isRestricted = node.routeUrl.startsWith('/candidate') || 
                                     node.routeUrl.startsWith('/recruiter') || 
                                     node.routeUrl.startsWith('/admin') ||
                                     node.routeUrl.startsWith('/feed');
                
                if (isRestricted && !this.authService.isLoggedIn()) {
                  this.history.push({
                    sender: 'bot',
                    text: `⚠️ Please log in first to access "${node.title}". Redirecting you to the Login page...`,
                    routeUrl: '/login',
                    timestamp: new Date()
                  });
                  this.scrollToBottom();
                  setTimeout(() => {
                    this.router.navigate(['/login']);
                  }, 2000);
                  return;
                }

                setTimeout(() => {
                  this.router.navigate([node.routeUrl]);
                }, 1500);
              }
            }
          });
        } else {
          // No match, show fallback message and display main menu again
          this.history.push({
            sender: 'bot',
            text: `🔍 Sorry, I couldn't find a specific support topic for "${query}". Here is the main menu to help you navigate:`,
            options: this.rootNodes,
            timestamp: new Date()
          });
          this.currentOptions = this.rootNodes;
          this.navigationStack = [];
          this.scrollToBottom();
        }
      },
      error: () => {
        this.history.push({
          sender: 'bot',
          text: `🔍 Sorry, I encountered an error searching for "${query}". Here is the main menu to help you navigate:`,
          options: this.rootNodes,
          timestamp: new Date()
        });
        this.currentOptions = this.rootNodes;
        this.navigationStack = [];
        this.scrollToBottom();
      }
    });
  }

  navigateToRoute(routeUrl: string) {
    this.router.navigate([routeUrl]);
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Ignore scroll failures
    }
  }
}
