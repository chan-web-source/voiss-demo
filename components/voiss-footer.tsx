import Link from "next/link";

export function VoissFooter() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Copyright and Links */}
                <div className="text-center">
                    <div className="flex justify-center space-x-6 mb-4">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        By Lucky Chan
                    </p>
                </div>
            </div>

        </footer>
    );
}
