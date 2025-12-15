import React from 'react';
import { Button } from './components/ui/button';
import { BookOpen, Search, User, ShieldCheck } from 'lucide-react';

const Home = ({ onNavigate }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="py-20" style={{ background: 'linear-gradient(to bottom, white, #f9fafb)' }}>
                <div className="container text-center">
                    <h1 className="h1-hero mb-6">
                        The Modern Library <br />
                        <span style={{ color: '#3b82f6' }}>Reimagined</span>
                    </h1>
                    <p className="p-lead mb-8">
                        Discover thousands of books, manage your reading list, and explore a world of knowledge with our advanced digital library system.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" onClick={() => onNavigate('catalog')}>
                            Browse Books
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => onNavigate('profile')}>
                            My Dashboard
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20" style={{ background: 'white' }}>
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-8" style={{ fontSize: '2rem', fontWeight: 700 }}>
                        Everything you need
                    </h2>
                    <div className="grid-3">
                        <div className="card">
                            <div className="icon-circle">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                            <p className="text-muted">
                                Instantly find books by title, author, or category using our powerful search engine.
                            </p>
                        </div>
                        <div className="card">
                            <div className="icon-circle">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Instant Import</h3>
                            <p className="text-muted">
                                Admins can import books directly from OpenLibrary API with a single click.
                            </p>
                        </div>
                        <div className="card">
                            <div className="icon-circle">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Admin Controls</h3>
                            <p className="text-muted">
                                Robust admin panel to manage users, roles, and inventory with ease.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer py-8">
                <div className="container text-center">
                    <p className="text-muted">© 2025 Library System. Built with Shadcn/UI Design & Spring Boot.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
