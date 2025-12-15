import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

export function Alert({ type = 'info', title, message, className }: AlertProps) {
  const styles = {
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      title: 'text-blue-800',
      message: 'text-blue-700',
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      title: 'text-green-800',
      message: 'text-green-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      title: 'text-yellow-800',
      message: 'text-yellow-700',
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      title: 'text-red-800',
      message: 'text-red-700',
    },
  };

  const style = styles[type];

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        style.container,
        className
      )}
    >
      <div className="flex-shrink-0">{style.icon}</div>
      <div className="flex-1">
        {title && (
          <h4 className={cn('font-medium mb-1', style.title)}>{title}</h4>
        )}
        <p className={cn('text-sm', style.message)}>{message}</p>
      </div>
    </div>
  );
}
