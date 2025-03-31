import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Information */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S3</span>
              </div>
              <span className="text-xl font-bold">S3vn Studies</span>
            </div>
            <p className="text-gray-400 mb-6">A community of curious minds dedicated to learning and growing together.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">About</Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-white transition">Articles</Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-400 hover:text-white transition">Videos</Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-400 hover:text-white transition">Store</Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition">Community</Link>
              </li>
            </ul>
          </div>
          
          {/* Membership */}
          <div>
            <h3 className="font-bold text-lg mb-6">Membership</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth" className="text-gray-400 hover:text-white transition">Join Now</Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
              </li>
              <li>
                <Link href="/community#faq" className="text-gray-400 hover:text-white transition">FAQ</Link>
              </li>
              <li>
                <Link href="/community#testimonials" className="text-gray-400 hover:text-white transition">Testimonials</Link>
              </li>
              <li>
                <Link href="/community#referral" className="text-gray-400 hover:text-white transition">Referral Program</Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/policies#terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/policies#privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies#copyright" className="text-gray-400 hover:text-white transition">Copyright</Link>
              </li>
              <li>
                <Link href="/policies#cookies" className="text-gray-400 hover:text-white transition">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} S3vn Studies. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <Link href="/about#contact" className="text-gray-400 hover:text-white transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
