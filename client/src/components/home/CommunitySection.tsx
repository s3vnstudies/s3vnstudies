import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Megaphone, Users } from "lucide-react";

const CommunitySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-medium">Community</span>
            <h2 className="text-3xl font-bold mt-2 mb-6">Connect With Like-Minded Individuals</h2>
            <p className="text-gray-600 mb-6">
              Our community brings together passionate individuals from around the world. Share ideas, collaborate on projects, and make meaningful connections.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Chat Rooms</h4>
                  <p className="text-gray-600">Join existing chat rooms or create your own based on specific topics and interests.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                  <Megaphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Community Bulletin</h4>
                  <p className="text-gray-600">Share announcements, events, and opportunities with the entire community.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Member Profiles</h4>
                  <p className="text-gray-600">Create your profile, showcase your expertise, and connect with other members.</p>
                </div>
              </li>
            </ul>
            <Button asChild className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/community">
                Explore Community <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-md bg-gray-300 h-40">
                {/* Image placeholder */}
              </div>
              <div className="rounded-xl overflow-hidden shadow-md bg-gray-300 h-64">
                {/* Image placeholder */}
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-xl overflow-hidden shadow-md bg-gray-300 h-64">
                {/* Image placeholder */}
              </div>
              <div className="rounded-xl overflow-hidden shadow-md bg-gray-300 h-40">
                {/* Image placeholder */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
