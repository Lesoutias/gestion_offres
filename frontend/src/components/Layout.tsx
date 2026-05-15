import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

function Layout({ children, title }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      {title ? (
        <h1 className="mb-6 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
      ) : null}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout;
