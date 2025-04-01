import { Link } from "wouter";
import { 
  Youtube, 
  Twitter, 
  Instagram, 
  Facebook, 
  Mail, 
  MessageCircle,
  Users,
  ShoppingBag,
  PenTool,
  Video,
  Newspaper,
  Info,
  Shield
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/static/images/logo.gif"
                alt="S3VN Studies Logo"
                className="h-10 mr-2" 
              />
              <span className="ml-2 text-xl font-poppins font-bold">S3VN<span className="text-primary">Studies</span></span>
            </div>
            <p className="text-gray-400 mb-6">
              A community for learners, creators, and explorers. Join us on our journey to create and share knowledge.
            </p>
            <div className="flex space-x-4">
              <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  About
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <PenTool className="h-4 w-4 mr-2" />
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/self-help-studies" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Self Help Studies
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/membership" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Store
                </Link>
              </li>
              <li>
                <Link href="/bulletin" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Bulletin Board
                </Link>
              </li>
              <li>
                <Link href="/fun-and-games" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Fun & Games
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about#contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Policies
                </Link>
              </li>
              <li>
                <Link href="/policies#terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/policies#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies#copyright" className="text-gray-400 hover:text-white transition-colors">Copyright</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
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