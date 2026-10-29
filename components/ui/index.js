import { clsx } from 'clsx';

export function Card({ children, className, hover = true, ...props }) {
    return (
        <div
            className={clsx(
                "bg-card text-card-foreground rounded-xl border shadow-sm transition-all duration-300",
                hover && "hover:-translate-y-1 hover:shadow-lg hover:border-primary/50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }) {
    return <div className={clsx("p-6 pb-3", className)} {...props}>{children}</div>;
}

export function CardContent({ children, className, ...props }) {
    return <div className={clsx("p-6 pt-0", className)} {...props}>{children}</div>;
}

export function Button({ children, variant = 'primary', className, ...props }) {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-11 px-8";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground"
    };

    return (
        <button className={clsx(baseStyles, variants[variant], className)} {...props}>
            {children}
        </button>
    );
}
