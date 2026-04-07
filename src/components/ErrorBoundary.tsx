import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-3">عذراً، حدث خطأ ما</h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              واجه التطبيق مشكلة غير متوقعة. يمكنك محاولة تحديث الصفحة أو العودة للرئيسية.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-slate-100 rounded-xl text-left text-xs font-mono text-red-600 overflow-auto max-h-40" dir="ltr">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                تحديث الصفحة
              </button>
              
              <a
                href="/"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Home size={20} />
                العودة للرئيسية
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
