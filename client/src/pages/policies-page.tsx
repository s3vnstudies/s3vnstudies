import { useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Copyright, Cookie, AlertCircle } from "lucide-react";

export default function PoliciesPage() {
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - Policies & Copyright";
  }, []);

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Policies & Legal Information</h1>
            <p className="text-xl">
              Important information about your rights and responsibilities as a member of our community
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="terms" className="space-y-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                <TabsTrigger value="terms" id="terms" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" /> Terms of Service
                </TabsTrigger>
                <TabsTrigger value="privacy" id="privacy" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" /> Privacy Policy
                </TabsTrigger>
                <TabsTrigger value="copyright" id="copyright" className="flex items-center">
                  <Copyright className="h-4 w-4 mr-2" /> Copyright
                </TabsTrigger>
                <TabsTrigger value="cookies" id="cookies" className="flex items-center">
                  <Cookie className="h-4 w-4 mr-2" /> Cookie Policy
                </TabsTrigger>
              </TabsList>
              
              {/* Terms of Service */}
              <TabsContent value="terms">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" /> Terms of Service
                    </CardTitle>
                    <CardDescription>
                      Last Updated: July 1, 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-6 pr-4">
                        <section>
                          <h3 className="text-xl font-bold mb-3">1. Acceptance of Terms</h3>
                          <p className="text-gray-600 mb-3">
                            By accessing or using S3vn Studies services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use our services.
                          </p>
                          <p className="text-gray-600">
                            These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">2. Description of Service</h3>
                          <p className="text-gray-600 mb-3">
                            S3vn Studies provides an online platform for educational content, community engagement, and merchandise sales. We reserve the right to modify, suspend or discontinue any part of the Service at any time.
                          </p>
                          <p className="text-gray-600">
                            Content on the platform includes articles, videos, interactive features, and user-generated content. Some content may require a paid membership to access.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">3. User Accounts</h3>
                          <p className="text-gray-600 mb-3">
                            In order to access certain features of the site, you will need to create an account. You are responsible for maintaining the confidentiality of your account information and password.
                          </p>
                          <p className="text-gray-600 mb-3">
                            You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
                          </p>
                          <p className="text-gray-600">
                            We reserve the right to terminate accounts, remove or edit content, or cancel orders at our sole discretion.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">4. Membership and Subscription</h3>
                          <p className="text-gray-600 mb-3">
                            S3vn Studies offers different membership tiers with varying levels of access and benefits. Subscription fees are charged on a recurring basis according to the plan you select.
                          </p>
                          <p className="text-gray-600 mb-3">
                            You may cancel your subscription at any time through your account settings. Upon cancellation, you will continue to have access to premium content until the end of your current billing period.
                          </p>
                          <p className="text-gray-600">
                            We reserve the right to change subscription prices upon reasonable notice. Such notice may be provided at any time by posting the changes to the S3vn Studies website.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">5. User Conduct</h3>
                          <p className="text-gray-600 mb-3">
                            You agree not to use the Service for any illegal purpose or in violation of any local, state, national, or international law. You agree not to:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>Harass, abuse, or harm another person</li>
                            <li>Impersonate another user or person</li>
                            <li>Use the account of another user</li>
                            <li>Provide false information</li>
                            <li>Create or submit unwanted email ("spam") to any other users</li>
                            <li>Infringe upon the rights of others, including patent, trademark, trade secret, copyright, or other proprietary rights</li>
                            <li>Transmit or upload any material that contains viruses, Trojan horses, worms, or any other harmful or destructive programs</li>
                          </ul>
                          <p className="text-gray-600">
                            Violation of these rules may result in termination of your account.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">6. Content Ownership and License</h3>
                          <p className="text-gray-600 mb-3">
                            All content provided on S3vn Studies, including text, graphics, logos, images, and software, is owned by S3vn Studies or its content suppliers and is protected by international copyright laws.
                          </p>
                          <p className="text-gray-600 mb-3">
                            We grant you a limited, non-exclusive, non-transferable license to access and make personal use of the content. This license does not include:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>Reselling or commercial use of the site or its contents</li>
                            <li>Collecting and using product listings, descriptions, or prices</li>
                            <li>Derivative use of the site or its contents</li>
                            <li>Downloading or copying account information</li>
                            <li>Using data mining, robots, or similar data gathering tools</li>
                          </ul>
                          <p className="text-gray-600">
                            Any unauthorized use terminates the permission or license granted by S3vn Studies.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">7. User-Generated Content</h3>
                          <p className="text-gray-600 mb-3">
                            Users may post content to our platform, including comments, forum posts, and community contributions. By submitting content, you grant S3vn Studies a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content.
                          </p>
                          <p className="text-gray-600">
                            You represent and warrant that you own or control all rights to the content you post, and that its use will not violate these Terms or cause injury to any person or entity.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">8. Merchandise and Purchases</h3>
                          <p className="text-gray-600 mb-3">
                            Products or services purchased through S3vn Studies are subject to our Return Policy. All item descriptions, pricing, promotions, and availability are subject to change without notice.
                          </p>
                          <p className="text-gray-600">
                            We make every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">9. Disclaimer of Warranties</h3>
                          <p className="text-gray-600 mb-3">
                            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. S3VN STUDIES EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                          </p>
                          <p className="text-gray-600">
                            S3VN STUDIES MAKES NO WARRANTY THAT THE SERVICE WILL MEET YOUR REQUIREMENTS, BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS, OR BE ACCURATE, RELIABLE, COMPLETE, LEGAL, OR SAFE.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">10. Limitation of Liability</h3>
                          <p className="text-gray-600 mb-3">
                            IN NO EVENT SHALL S3VN STUDIES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                          </p>
                          <p className="text-gray-600">
                            S3VN STUDIES' TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS SHALL NOT EXCEED THE AMOUNTS YOU HAVE PAID TO S3VN STUDIES IN THE LAST 12 MONTHS.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">11. Governing Law</h3>
                          <p className="text-gray-600">
                            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to these Terms shall be brought exclusively in the federal or state courts located in the United States and you consent to such jurisdiction.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">12. Changes to Terms</h3>
                          <p className="text-gray-600">
                            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on the website and updating the "Last Updated" date. Your continued use of the Service after such modifications constitutes your acceptance of the modified Terms.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">13. Contact Information</h3>
                          <p className="text-gray-600">
                            For questions about these Terms of Service, please contact us at legal@s3vnstudies.com.
                          </p>
                        </section>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Privacy Policy */}
              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" /> Privacy Policy
                    </CardTitle>
                    <CardDescription>
                      Last Updated: July 1, 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-6 pr-4">
                        <section>
                          <h3 className="text-xl font-bold mb-3">1. Introduction</h3>
                          <p className="text-gray-600 mb-3">
                            S3vn Studies respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                          </p>
                          <p className="text-gray-600">
                            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">2. Information We Collect</h3>
                          <p className="text-gray-600 mb-3">
                            We may collect several types of information from and about users of our website, including:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>Personal identifiers (such as name, email address, and username)</li>
                            <li>Contact information (billing address, shipping address)</li>
                            <li>Payment information (credit card numbers, though we do not store full credit card information)</li>
                            <li>Profile information (such as your preferences, interests, and subscription status)</li>
                            <li>Usage data (how you interact with our website)</li>
                            <li>Device and connection information (IP address, browser type, operating system)</li>
                          </ul>
                          <p className="text-gray-600">
                            We collect this information when you register on our site, place an order, subscribe to our service, participate in discussion forums, or enter information on our site.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">3. How We Use Your Information</h3>
                          <p className="text-gray-600 mb-3">
                            We may use the information we collect about you for various purposes, including:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>To provide and maintain our services</li>
                            <li>To process transactions and send related information</li>
                            <li>To manage your account and provide customer support</li>
                            <li>To personalize and improve your experience</li>
                            <li>To send promotional emails about new products, special offers, or other information</li>
                            <li>To enforce our rights arising from contracts entered into between you and us</li>
                            <li>To analyze usage patterns and optimize our service</li>
                          </ul>
                          <p className="text-gray-600">
                            We will only use your personal information for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason compatible with the original purpose.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">4. Information Sharing</h3>
                          <p className="text-gray-600 mb-3">
                            We may share your personal information in the following situations:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, and contractors who perform services for us.</li>
                            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger, acquisition, or sale of all or a portion of our business.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose your information when required to do so by law or in response to legal process, or to protect our rights.</li>
                            <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
                          </ul>
                          <p className="text-gray-600">
                            We do not sell, rent, or lease our customer lists to third parties.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">5. Data Security</h3>
                          <p className="text-gray-600 mb-3">
                            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
                          </p>
                          <p className="text-gray-600 mb-3">
                            The safety and security of your information also depends on you. We urge you to be careful about giving out information in public areas of the website like message boards, which may be viewed by other users.
                          </p>
                          <p className="text-gray-600">
                            Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our website.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">6. Data Retention</h3>
                          <p className="text-gray-600">
                            We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">7. Your Rights</h3>
                          <p className="text-gray-600 mb-3">
                            Depending on your location, you may have certain rights regarding your personal information, such as:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>The right to access your personal information</li>
                            <li>The right to rectify incorrect personal information</li>
                            <li>The right to request the deletion of your personal information</li>
                            <li>The right to restrict the processing of your personal information</li>
                            <li>The right to data portability</li>
                            <li>The right to object to the processing of your personal information</li>
                          </ul>
                          <p className="text-gray-600">
                            To exercise any of these rights, please contact us using the information provided at the end of this policy.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">8. Children's Privacy</h3>
                          <p className="text-gray-600">
                            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so that we can delete such information.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">9. Changes to Our Privacy Policy</h3>
                          <p className="text-gray-600">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">10. Contact Information</h3>
                          <p className="text-gray-600">
                            If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@s3vnstudies.com.
                          </p>
                        </section>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Copyright */}
              <TabsContent value="copyright">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Copyright className="h-5 w-5 mr-2" /> Copyright Policy
                    </CardTitle>
                    <CardDescription>
                      Last Updated: July 1, 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-6 pr-4">
                        <section>
                          <h3 className="text-xl font-bold mb-3">1. Copyright Protection</h3>
                          <p className="text-gray-600 mb-3">
                            All content included on this website, such as text, graphics, logos, images, videos, and software, is the property of S3vn Studies or its content suppliers and is protected by United States and international copyright laws.
                          </p>
                          <p className="text-gray-600">
                            The compilation of all content on this site is the exclusive property of S3vn Studies and is protected by United States and international copyright laws.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">2. Permitted Use</h3>
                          <p className="text-gray-600 mb-3">
                            S3vn Studies grants you a limited, non-exclusive, non-transferable license to access and make personal use of this website and its content. This license does not include:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>Any resale or commercial use of this website or its contents</li>
                            <li>Any collection and use of any product listings, descriptions, or prices</li>
                            <li>Any derivative use of this website or its contents</li>
                            <li>Any downloading or copying of account information for the benefit of another merchant</li>
                            <li>Any use of data mining, robots, or similar data gathering and extraction tools</li>
                          </ul>
                          <p className="text-gray-600">
                            This website or any portion of this website may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent of S3vn Studies.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">3. User-Generated Content</h3>
                          <p className="text-gray-600 mb-3">
                            By submitting any content, comments, or material to our site, you grant S3vn Studies a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display such content.
                          </p>
                          <p className="text-gray-600">
                            You represent and warrant that you own or control all rights to the content you submit, and that your content does not infringe upon the intellectual property rights of others.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">4. Digital Millennium Copyright Act (DMCA) Compliance</h3>
                          <p className="text-gray-600 mb-3">
                            S3vn Studies respects the intellectual property rights of others and expects users of the service to do the same. We will respond to notices of alleged copyright infringement that comply with applicable law.
                          </p>
                          <p className="text-gray-600 mb-3">
                            If you believe that your content has been copied in a way that constitutes copyright infringement, please provide us with the following information:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
                            <li>Identification of the copyrighted work claimed to have been infringed</li>
                            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed</li>
                            <li>Your contact information, including your address, telephone number, and an email address</li>
                            <li>A statement by you that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
                            <li>A statement that the information in the notification is accurate, and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
                          </ul>
                          <p className="text-gray-600">
                            We reserve the right to remove content alleged to be infringing without prior notice, at our sole discretion, and without liability to you. We will terminate a user's access to the service if they are determined to be repeat infringers.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">5. Trademarks</h3>
                          <p className="text-gray-600 mb-3">
                            S3vn Studies, the S3vn Studies logo, and all related names, logos, product and service names, designs, and slogans are trademarks of S3vn Studies or its affiliates or licensors. You must not use such marks without the prior written permission of S3vn Studies.
                          </p>
                          <p className="text-gray-600">
                            All other names, logos, product and service names, designs, and slogans on this website are the trademarks of their respective owners.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">6. Copyright Licensing for Educational Use</h3>
                          <p className="text-gray-600 mb-3">
                            Teachers and educational institutions may use limited portions of our content for educational purposes under the following conditions:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>The content is used solely for non-commercial, educational purposes</li>
                            <li>Proper attribution is given to S3vn Studies</li>
                            <li>The content is not modified in a way that alters its meaning</li>
                            <li>Access is restricted to students enrolled in the course</li>
                          </ul>
                          <p className="text-gray-600">
                            For more extensive educational use, please contact us to discuss licensing options.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">7. Third-Party Content</h3>
                          <p className="text-gray-600">
                            This website may include content provided by third parties, including materials provided by other users, bloggers, and third-party licensors. All statements and/or opinions expressed in these materials, and all content other than the content provided by S3vn Studies, are solely the opinions and the responsibility of the person or entity providing those materials.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">8. International Users</h3>
                          <p className="text-gray-600">
                            This website is controlled, operated, and administered by S3vn Studies from the United States. If you access this website from a location outside the United States, you are responsible for compliance with all local laws. You agree not to use the S3vn Studies content accessed through this website in any country or in any manner prohibited by any applicable laws, restrictions, or regulations.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">9. Contact Information</h3>
                          <p className="text-gray-600 mb-3">
                            If you have any questions about our Copyright Policy or to report a copyright infringement claim, please contact:
                          </p>
                          <p className="text-gray-600">
                            Copyright Agent<br />
                            S3vn Studies<br />
                            copyright@s3vnstudies.com
                          </p>
                        </section>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Cookie Policy */}
              <TabsContent value="cookies">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cookie className="h-5 w-5 mr-2" /> Cookie Policy
                    </CardTitle>
                    <CardDescription>
                      Last Updated: July 1, 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-6 pr-4">
                        <section>
                          <h3 className="text-xl font-bold mb-3">1. What Are Cookies</h3>
                          <p className="text-gray-600 mb-3">
                            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
                          </p>
                          <p className="text-gray-600">
                            Cookies help us improve your experience on our site by remembering your preferences, understanding how you use our site, and tailoring content to your interests.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">2. Types of Cookies We Use</h3>
                          <p className="text-gray-600 mb-3">
                            We use the following types of cookies on our website:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You may disable these by changing your browser settings, but this may affect how the website functions.</li>
                            <li><strong>Performance/Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.</li>
                            <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
                            <li><strong>Targeting/Advertising Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.</li>
                          </ul>
                          <p className="text-gray-600">
                            Third-party cookies are cookies that are set by a domain other than the one you are visiting. We allow selected third parties to place cookies through our site for analytics and advertising purposes.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">3. How We Use Cookies</h3>
                          <p className="text-gray-600 mb-3">
                            We use cookies for the following purposes:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li>To authenticate users and remember log-in information</li>
                            <li>To remember preferences and settings</li>
                            <li>To maintain shopping cart contents</li>
                            <li>To analyze site traffic and user behavior</li>
                            <li>To enable targeted advertising</li>
                            <li>To improve website performance and functionality</li>
                          </ul>
                          <p className="text-gray-600">
                            The information collected through cookies is used only for these stated purposes and is not used for any other purpose.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">4. Third-Party Cookies</h3>
                          <p className="text-gray-600 mb-3">
                            We use services from the following third parties that may set cookies on your device:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                            <li><strong>Google Analytics:</strong> For analyzing website traffic and user behavior</li>
                            <li><strong>Google AdSense:</strong> For displaying targeted advertisements</li>
                            <li><strong>Facebook:</strong> For social sharing and advertising</li>
                            <li><strong>YouTube:</strong> For video content embedding</li>
                            <li><strong>Stripe:</strong> For payment processing</li>
                          </ul>
                          <p className="text-gray-600">
                            Each of these third parties has their own privacy and cookie policies. We encourage you to read these policies on their respective websites.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">5. Managing Cookies</h3>
                          <p className="text-gray-600 mb-3">
                            Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The Help function within your browser should tell you how.
                          </p>
                          <p className="text-gray-600 mb-3">
                            Please note that if you disable or refuse cookies, some parts of the website may become inaccessible or not function properly.
                          </p>
                          <p className="text-gray-600">
                            To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="http://www.allaboutcookies.org" className="text-primary hover:underline">www.allaboutcookies.org</a>.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">6. AdSense and Advertising</h3>
                          <p className="text-gray-600 mb-3">
                            We use Google AdSense to display advertisements on our website. Google AdSense may use cookies to personalize the advertisements and to determine the frequency with which you see a particular ad.
                          </p>
                          <p className="text-gray-600 mb-3">
                            Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.
                          </p>
                          <p className="text-gray-600">
                            You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline">Google Ads Settings</a>.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">7. Changes to Our Cookie Policy</h3>
                          <p className="text-gray-600">
                            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
                          </p>
                        </section>
                        
                        <section>
                          <h3 className="text-xl font-bold mb-3">8. Contact Information</h3>
                          <p className="text-gray-600">
                            If you have any questions about our Cookie Policy, please contact us at privacy@s3vnstudies.com.
                          </p>
                        </section>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Have Questions About Our Policies?</h2>
            <p className="text-gray-600 mb-8">
              If you have any questions or concerns regarding our policies, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Card className="flex-1">
                <CardContent className="pt-6 flex flex-col items-center">
                  <AlertCircle className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Policy Questions</h3>
                  <p className="text-gray-600 text-center mb-4">
                    For questions about our policies or legal matters
                  </p>
                  <p className="font-medium">legal@s3vnstudies.com</p>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardContent className="pt-6 flex flex-col items-center">
                  <Copyright className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Copyright Issues</h3>
                  <p className="text-gray-600 text-center mb-4">
                    For copyright claims or intellectual property concerns
                  </p>
                  <p className="font-medium">copyright@s3vnstudies.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
