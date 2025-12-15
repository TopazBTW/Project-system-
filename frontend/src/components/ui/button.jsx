import React from 'react';

const Button = React.forwardRef(({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {

    let variantClass = 'btn-primary';
    if (variant === 'outline') variantClass = 'btn-outline';
    if (variant === 'destructive') variantClass = 'btn-destructive';
    if (variant === 'ghost') variantClass = 'btn-ghost';

    let sizeClass = '';
    if (size === 'lg') sizeClass = 'btn-lg';
    if (size === 'sm') sizeClass = 'btn-sm';

    const finalClass = `btn ${variantClass} ${sizeClass} ${className}`;

    return (
        <button
            className={finalClass}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
});
Button.displayName = "Button"

export { Button }
