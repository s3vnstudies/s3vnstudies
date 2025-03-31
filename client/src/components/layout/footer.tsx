import { Link } from "wouter";
import {
  Youtube,
  Twitter,
  Instagram,
  Twitch,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-lg">S7</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-white font-poppins">S3vn Studies</span>
            </div>
            <p className="text-neutral-400 mb-6">
              Join our community of curious minds exploring knowledge, sharing ideas, and building connections.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://youtube.com/@s3vnstudies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Twitch className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-neutral-400 hover:text-white transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-neutral-400 hover:text-white transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-neutral-400 hover:text-white transition-colors">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-neutral-400 hover:text-white transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins">Membership</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auth"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Join Membership
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Member Login
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Membership Benefits
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Chat Rooms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/policies"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Copyright Information
                </Link>
              </li>
              <li>
                <Link
                  href="/policies"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} S3vn Studies. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <Link
                href="/policies"
                className="text-neutral-500 hover:text-white text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/policies"
                className="text-neutral-500 hover:text-white text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/policies"
                className="text-neutral-500 hover:text-white text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
