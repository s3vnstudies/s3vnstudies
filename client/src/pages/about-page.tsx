import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  LucideAward, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Calendar, 
  BookOpen 
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - S3VN Studies</title>
        <meta name="description" content="Learn about S3VN Studies, our mission, values, and the team behind our community of creators and learners." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">About S3VN Studies</h1>
                <p className="text-xl opacity-90 mb-8">
                  We're a community of passionate creators, learners, and explorers on a mission to help each other grow and succeed in the digital landscape.
                </p>
              </div>
            </div>
          </section>
          
          {/* Our Story */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-poppins font-bold mb-6">Our Story</h2>
                  <p className="text-gray-700 mb-4">
                    S3VN Studies began as a small YouTube channel focused on sharing knowledge and insights about content creation. As our audience grew, we realized there was a need for a more immersive and interactive learning experience.
                  </p>
                  <p className="text-gray-700 mb-4">
                    In 2023, we launched this platform to create a space where creators of all levels could connect, learn, and grow together. Our community quickly flourished into a vibrant ecosystem of support and collaboration.
                  </p>
                  <p className="text-gray-700">
                    Today, S3VN Studies is more than just a learning platform—it's a thriving community where members gain access to exclusive content, connect with like-minded individuals, and develop their skills in a supportive environment.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent rounded-full bg-opacity-20"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary rounded-full bg-opacity-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                    alt="Content creator working at desk" 
                    className="w-full h-auto rounded-xl shadow-lg relative z-10"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Our Mission & Values */}
          <section className="py-16 bg-light-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-poppins font-bold mb-4">Our Mission & Values</h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  We're driven by a commitment to make quality education accessible and to foster a supportive community for creators at every stage of their journey.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                    <LucideAward className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-3">Quality Education</h3>
                  <p className="text-gray-700">
                    We believe in providing high-quality, actionable content that helps our members achieve real results in their creative pursuits.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                    <Lightbulb className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-3">Innovation</h3>
                  <p className="text-gray-700">
                    We constantly explore new teaching methods, technologies, and content formats to provide the best learning experience for our community.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-3">Community Support</h3>
                  <p className="text-gray-700">
                    We foster an inclusive environment where members can connect, collaborate, and support each other on their creative journeys.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* What We Offer */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-poppins font-bold mb-4">What We Offer</h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Our platform provides a range of resources and features designed to help you grow as a creator.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                    <BookOpen className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Premium Content</h3>
                  <p className="text-gray-700">
                    Access in-depth tutorials, guides, and exclusive content not available on our public channels.
                  </p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                    <Users className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Community Access</h3>
                  <p className="text-gray-700">
                    Connect with like-minded creators in our dedicated chat rooms and community forums.
                  </p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                    <Calendar className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Live Events</h3>
                  <p className="text-gray-700">
                    Participate in regular Q&A sessions, workshops, and interactive live events.
                  </p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                    <TrendingUp className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Growth Resources</h3>
                  <p className="text-gray-700">
                    Get access to tools, templates, and resources to help accelerate your growth as a creator.
                  </p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                    <LucideAward className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Recognition Program</h3>
                  <p className="text-gray-700">
                    Participate in our member spotlight program to showcase your work to the community.
                  </p>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                    <Users className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">Networking Opportunities</h3>
                  <p className="text-gray-700">
                    Build valuable connections and potential collaborations with fellow creators and industry professionals.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Join Us CTA */}
          <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-poppins font-bold mb-6">Ready to Join Our Community?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Become a part of S3VN Studies today and take your creative journey to the next level.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a href="/membership" className="bg-white text-primary font-montserrat font-semibold text-lg px-8 py-3 rounded-full hover:shadow-xl transition-shadow text-center">
                  Become a Member
                </a>
                <a href="/contact" className="bg-transparent border-2 border-white font-montserrat font-semibold text-lg px-8 py-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-all text-center">
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
