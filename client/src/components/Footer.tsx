import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                S3
              </div>
              <span className="ml-2 text-xl font-poppins font-bold">S3VN Studies</span>
            </div>
            <p className="text-gray-400 mb-6">
              A community for learners, creators, and explorers. Join us on our journey to create and share knowledge.
            </p>
            <div className="flex space-x-4">
              <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-400 hover:text-white transition-colors">Videos</Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-white transition-colors">Articles</Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors">Community</Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-400 hover:text-white transition-colors">Store</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Membership</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/membership" className="text-gray-400 hover:text-white transition-colors">Join Now</Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-400 hover:text-white transition-colors">Login</Link>
              </li>
              <li>
                <Link href="/membership" className="text-gray-400 hover:text-white transition-colors">Membership Benefits</Link>
              </li>
              <li>
                <Link href="/membership" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/membership#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/policies#terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/policies#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies#cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/policies#copyright" className="text-gray-400 hover:text-white transition-colors">Copyright</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} S3VN Studies. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/about#contact" className="text-gray-400 hover:text-white transition-colors text-sm">
              Contact Us
            </Link>
            <Link href="/membership#support" className="text-gray-400 hover:text-white transition-colors text-sm">
              Support
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors text-sm">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
