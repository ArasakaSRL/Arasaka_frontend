import Header from "@/components/welcome/Header"

interface WelcomeLayoutProps {
    children: React.ReactNode
}

export default function WelcomeLayout({ children }: WelcomeLayoutProps) {
    return (
        <div className="w-full min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 w-full">
                <div className="animate-in fade-in duration-700">
                    {children}
                </div>
            </main>
        </div>
    )
}
