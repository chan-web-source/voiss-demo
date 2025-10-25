import Link from "next/link";

export function FlexFooter() {
    return (
        <footer className="bg-[#284E4C] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Copyright and Links */}
                <div className="text-center">
                    <div className="flex justify-center space-x-6 mb-4">
                        <Link
                            href="/"
                            className="text-gray-200 hover:text-white text-sm"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/"
                            className="text-gray-200 hover:text-white text-sm"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                    <p className="text-gray-200 text-sm mb-4">
                        © 2025 The Flex. All rights reserved.
                    </p>
                </div>
            </div>

        </footer>
    );
}
