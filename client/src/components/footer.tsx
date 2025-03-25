import { Link } from "wouter";
import { 
  Youtube, 
  Twitter, 
  Instagram, 
  Facebook,
  Discord 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="font-heading text-2xl font-bold text-white">S3VN <span className="text-cyan-500">Studies</span></span>
            </div>
            <p className="text-neutral-400 mb-6 max-w-md">
              Empowering minds through engaging content, community connection, and continuous learning.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Discord size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="text-neutral-400 hover:text-white transition">About</Link></li>
              <li><Link href="/articles" className="text-neutral-400 hover:text-white transition">Articles</Link></li>
              <li><Link href="/videos" className="text-neutral-400 hover:text-white transition">Videos</Link></li>
              <li><Link href="/store" className="text-neutral-400 hover:text-white transition">Store</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/chat" className="text-neutral-400 hover:text-white transition">Chat Rooms</Link></li>
              <li><Link href="/bulletin" className="text-neutral-400 hover:text-white transition">Bulletin Board</Link></li>
              <li><Link href="/games" className="text-neutral-400 hover:text-white transition">Fun & Games</Link></li>
              <li><Link href="/profile" className="text-neutral-400 hover:text-white transition">Member Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about#contact" className="text-neutral-400 hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/policy#faq" className="text-neutral-400 hover:text-white transition">FAQs</Link></li>
              <li><Link href="/profile?tab=membership" className="text-neutral-400 hover:text-white transition">Membership</Link></li>
              <li><Link href="/policy#privacy" className="text-neutral-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/policy#terms" className="text-neutral-400 hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} S3VN Studies. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/policy#privacy" className="text-neutral-500 hover:text-white text-sm transition">Privacy Policy</Link>
              <Link href="/policy#terms" className="text-neutral-500 hover:text-white text-sm transition">Terms of Service</Link>
              <Link href="/policy#cookies" className="text-neutral-500 hover:text-white text-sm transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
