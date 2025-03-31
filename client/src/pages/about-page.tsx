import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">About S3vn Studies</h1>
            <p className="text-xl text-gray-600 mb-8">
              Dedicated to learning, growing, and sharing knowledge with a community of curious minds.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At S3vn Studies, we're on a mission to create a vibrant community where passionate individuals can connect, learn, and grow together. We believe that knowledge is most valuable when shared, and that community support accelerates personal growth.
              </p>
              <p className="text-gray-600">
                Through our diverse content, interactive platform, and supportive environment, we aim to empower everyone to pursue continuous learning and development in their areas of interest.
              </p>
            </div>
            <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-lg">Mission Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">The Founder's Story</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400">Photo</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Alex Johnson</h3>
                  <p className="text-gray-500">Founder & Content Creator</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                The journey of S3vn Studies began five years ago when I realized there was a gap in how educational content was being delivered and experienced online. With a background in education and technology, I wanted to create a space that wasn't just about passive consumption of information, but active engagement and community building.
              </p>
              <p className="text-gray-600">
                What started as a simple YouTube channel has evolved into a multi-faceted platform where members can access exclusive content, connect with like-minded individuals, and participate in collaborative learning experiences. I'm incredibly proud of the community we've built together, and excited about where we're headed next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-book text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Educational Content</h3>
              <p className="text-gray-600">
                Articles, videos, and workshops covering a wide range of topics, from technology and personal development to creative skills and more.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-users text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Vibrant Community</h3>
              <p className="text-gray-600">
                Connect with fellow members through chat rooms, bulletin boards, and virtual events to share ideas and collaborate on projects.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-trophy text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Member Benefits</h3>
              <p className="text-gray-600">
                Exclusive access to premium content, early releases, one-on-one consultations, and special discounts on merchandise and events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50" id="contact">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions, suggestions, or just want to say hello? We'd love to hear from you!
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-envelope text-blue-600"></i>
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-600">contact@s3vnstudies.com</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-map-marker-alt text-blue-600"></i>
                </div>
                <h3 className="font-bold mb-2">Location</h3>
                <p className="text-gray-600">San Francisco, CA</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fab fa-youtube text-blue-600"></i>
                </div>
                <h3 className="font-bold mb-2">YouTube</h3>
                <p className="text-gray-600">@s3vnstudies</p>
              </div>
            </div>
            
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/community">Join Our Community</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
