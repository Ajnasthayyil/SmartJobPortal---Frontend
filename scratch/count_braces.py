
with open('src/app/features/courses/courses.component.html', 'r', encoding='utf-8') as f:
    content = f.read()
    open_count = content.count('{')
    close_count = content.count('}')
    print(f"Open: {open_count}, Close: {close_count}")
    
    # Check for unclosed {{
    double_open = content.count('{{')
    double_close = content.count('}}')
    print(f"Double Open: {double_open}, Double Close: {double_close}")
    
    # Check for @if/{ pairs
    at_if = content.count('@if')
    at_for = content.count('@for')
    print(f"@if: {at_if}, @for: {at_for}")
