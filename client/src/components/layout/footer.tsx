import { Link } from "wouter";
import { ROUTES } from "@/lib/constants";
import { Twitter, Youtube, Instagram } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href={ROUTES.HOME} className="flex items-center">
              <span className="text-white text-2xl font-accent font-bold">S3VN</span>
              <span className="text-gray-300 text-xl ml-1 font-semibold">Studies</span>
            </Link>
            <p className="text-gray-400 text-base">
              Providing valuable content, community, and resources to help you grow and develop.
            </p>
            <div className="flex space-x-6">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Discord</span>
                <FaDiscord className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Navigation
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href={ROUTES.HOME} className="text-base text-gray-400 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.ABOUT} className="text-base text-gray-400 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.ARTICLES} className="text-base text-gray-400 hover:text-white">
                      Articles
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.VIDEOS} className="text-base text-gray-400 hover:text-white">
                      Videos
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.STORE} className="text-base text-gray-400 hover:text-white">
                      Store
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Community
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href={ROUTES.CHAT} className="text-base text-gray-400 hover:text-white">
                      Chat Rooms
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.BULLETIN} className="text-base text-gray-400 hover:text-white">
                      Bulletin Board
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.GAMES} className="text-base text-gray-400 hover:text-white">
                      Fun & Games
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.COMMUNITY} className="text-base text-gray-400 hover:text-white">
                      Members Directory
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Membership
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href={ROUTES.MEMBERSHIP} className="text-base text-gray-400 hover:text-white">
                      Benefits
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.MEMBERSHIP} className="text-base text-gray-400 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.MEMBERSHIP} className="text-base text-gray-400 hover:text-white">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href={`${ROUTES.POLICIES}#privacy`} className="text-base text-gray-400 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href={`${ROUTES.POLICIES}#terms`} className="text-base text-gray-400 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href={`${ROUTES.POLICIES}#copyright`} className="text-base text-gray-400 hover:text-white">
                      Copyright
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} S3VN Studies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
