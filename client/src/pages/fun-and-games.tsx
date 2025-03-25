import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Gamepad2, Trophy, Award, Gift, Brain, Zap } from "lucide-react";

export default function FunAndGamesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("quiz");
  
  // Quiz game state
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Memory game state
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryCompleted, setMemoryCompleted] = useState(false);
  
  // Word scramble game state
  const [scrambleInput, setScrambleInput] = useState("");
  const [scrambleScore, setScrambleScore] = useState(0);
  const [currentScramble, setCurrentScramble] = useState(0);
  const [scrambleCompleted, setScrambleCompleted] = useState(false);

  // Quiz questions
  const quizQuestions = [
    {
      question: "What is the most common format for online video content?",
      options: ["MP4", "AVI", "MOV", "WMV"],
      correctAnswer: 0,
    },
    {
      question: "Which social media platform specializes in short-form video content?",
      options: ["Facebook", "LinkedIn", "TikTok", "Pinterest"],
      correctAnswer: 2,
    },
    {
      question: "What does SEO stand for?",
      options: ["Search Engine Optimization", "Social Engagement Online", "Search Engine Output", "Site Enhancement Options"],
      correctAnswer: 0,
    },
    {
      question: "Which of these is NOT a common video editing software?",
      options: ["Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "PhotoScape"],
      correctAnswer: 3,
    },
    {
      question: "What is the recommended aspect ratio for YouTube videos?",
      options: ["1:1", "4:3", "16:9", "21:9"],
      correctAnswer: 2,
    },
  ];
  
  // Memory game cards
  const memoryCards = [
    { id: 1, content: "📸", matched: false },
    { id: 2, content: "📸", matched: false },
    { id: 3, content: "🎬", matched: false },
    { id: 4, content: "🎬", matched: false },
    { id: 5, content: "🎥", matched: false },
    { id: 6, content: "🎥", matched: false },
    { id: 7, content: "🎙️", matched: false },
    { id: 8, content: "🎙️", matched: false },
    { id: 9, content: "💻", matched: false },
    { id: 10, content: "💻", matched: false },
    { id: 11, content: "🎮", matched: false },
    { id: 12, content: "🎮", matched: false },
  ].sort(() => Math.random() - 0.5);

  // Word scramble words
  const scrambleWords = [
    { original: "CONTENT", scrambled: "TNECONT" },
    { original: "CREATOR", scrambled: "AERTCOR" },
    { original: "YOUTUBE", scrambled: "UUBTEYOU" },
    { original: "EDITING", scrambled: "NITEGID" },
    { original: "COMMUNITY", scrambled: "UMMOCITYN" },
  ];

  // Handle quiz answer selection
  const handleQuizAnswer = (selectedOption: number) => {
    const currentQuestion = quizQuestions[currentQuizQuestion];
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setQuizScore(quizScore + 1);
      toast({
        title: "Correct!",
        description: "You selected the right answer.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        variant: "destructive",
      });
    }
    
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuizQuestion(0);
    setQuizScore(0);
    setQuizCompleted(false);
  };
  
  // Handle memory card flip
  const handleCardFlip = (cardId: number) => {
    // If the card is already flipped or matched, do nothing
    if (flippedCards.includes(cardId) || matchedPairs.includes(cardId)) {
      return;
    }
    
    // If 2 cards are already flipped, do nothing
    if (flippedCards.length === 2) {
      return;
    }
    
    // Flip the card
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // If this is the second card, check for a match
    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = memoryCards.find(card => card.id === firstCardId);
      const secondCard = memoryCards.find(card => card.id === secondCardId);
      
      setMemoryMoves(memoryMoves + 1);
      
      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        // Match found
        setMatchedPairs([...matchedPairs, firstCardId, secondCardId]);
        setFlippedCards([]);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 2 === memoryCards.length) {
          setMemoryCompleted(true);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  // Reset memory game
  const resetMemoryGame = () => {
    setFlippedCards([]);
    setMatchedPairs([]);
    setMemoryMoves(0);
    setMemoryCompleted(false);
  };
  
  // Handle word scramble input
  const handleScrambleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentWord = scrambleWords[currentScramble];
    
    if (scrambleInput.toUpperCase() === currentWord.original) {
      setScrambleScore(scrambleScore + 1);
      toast({
        title: "Correct!",
        description: "You unscrambled the word correctly.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct word was: ${currentWord.original}`,
        variant: "destructive",
      });
    }
    
    setScrambleInput("");
    
    if (currentScramble < scrambleWords.length - 1) {
      setCurrentScramble(currentScramble + 1);
    } else {
      setScrambleCompleted(true);
    }
  };
  
  // Reset word scramble
  const resetScramble = () => {
    setScrambleInput("");
    setScrambleScore(0);
    setCurrentScramble(0);
    setScrambleCompleted(false);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
            Fun & Games
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Take a break and have some fun with our selection of games and interactive challenges!
          </p>
        </div>
      </section>
      
      {/* Games Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="quiz" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <TabsList className="bg-white">
                <TabsTrigger value="quiz" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Brain className="h-4 w-4 mr-2" />
                  Content Creator Quiz
                </TabsTrigger>
                <TabsTrigger value="memory" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Trophy className="h-4 w-4 mr-2" />
                  Memory Match
                </TabsTrigger>
                <TabsTrigger value="scramble" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Word Scramble
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Quiz Game */}
            <TabsContent value="quiz">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">Content Creator Quiz</CardTitle>
                  <CardDescription className="text-center">
                    Test your knowledge of content creation and digital media
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quizCompleted ? (
                    <div className="text-center py-8">
                      <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                      <p className="text-xl mb-4">Your Score: <span className="font-bold">{quizScore}/{quizQuestions.length}</span></p>
                      <p className="text-slate-500 mb-6">
                        {quizScore === quizQuestions.length
                          ? "Perfect score! You're a content creation expert!"
                          : quizScore >= quizQuestions.length * 0.6
                          ? "Great job! You know your stuff!"
                          : "Keep learning and try again soon!"}
                      </p>
                      <Button onClick={resetQuiz} className="bg-gradient-to-r from-primary to-secondary">
                        Play Again
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <Badge variant="outline">
                          Question {currentQuizQuestion + 1} of {quizQuestions.length}
                        </Badge>
                        <Badge variant="secondary">
                          Score: {quizScore}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-6">
                        {quizQuestions[currentQuizQuestion].question}
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start text-left p-4 h-auto"
                            onClick={() => handleQuizAnswer(index)}
                          >
                            <span className="flex-1">{option}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Memory Match Game */}
            <TabsContent value="memory">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">Memory Match</CardTitle>
                  <CardDescription className="text-center">
                    Find matching pairs of content creation symbols
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {memoryCompleted ? (
                    <div className="text-center py-8">
                      <Award className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Game Completed!</h3>
                      <p className="text-xl mb-4">Total Moves: <span className="font-bold">{memoryMoves}</span></p>
                      <p className="text-slate-500 mb-6">
                        {memoryMoves <= 8
                          ? "Amazing memory! You're a natural!"
                          : memoryMoves <= 12
                          ? "Great job! That's a good score!"
                          : "Good effort! Keep practicing to improve!"}
                      </p>
                      <Button onClick={resetMemoryGame} className="bg-gradient-to-r from-primary to-secondary">
                        Play Again
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <Badge variant="outline">
                          Pairs Found: {matchedPairs.length / 2} of {memoryCards.length / 2}
                        </Badge>
                        <Badge variant="secondary">
                          Moves: {memoryMoves}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {memoryCards.map((card) => (
                          <div
                            key={card.id}
                            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer text-3xl 
                              ${flippedCards.includes(card.id) || matchedPairs.includes(card.id)
                                ? "bg-primary text-white"
                                : "bg-slate-200 text-slate-200 hover:bg-slate-300"
                              } transition-all`}
                            onClick={() => handleCardFlip(card.id)}
                          >
                            {flippedCards.includes(card.id) || matchedPairs.includes(card.id)
                              ? card.content
                              : "?"}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Word Scramble Game */}
            <TabsContent value="scramble">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">Word Scramble</CardTitle>
                  <CardDescription className="text-center">
                    Unscramble words related to content creation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scrambleCompleted ? (
                    <div className="text-center py-8">
                      <Gift className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Game Completed!</h3>
                      <p className="text-xl mb-4">Your Score: <span className="font-bold">{scrambleScore}/{scrambleWords.length}</span></p>
                      <p className="text-slate-500 mb-6">
                        {scrambleScore === scrambleWords.length
                          ? "Perfect score! Your vocabulary is impressive!"
                          : scrambleScore >= scrambleWords.length * 0.6
                          ? "Great job! You have excellent word skills!"
                          : "Keep practicing to improve your word unscrambling skills!"}
                      </p>
                      <Button onClick={resetScramble} className="bg-gradient-to-r from-primary to-secondary">
                        Play Again
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <Badge variant="outline">
                          Word {currentScramble + 1} of {scrambleWords.length}
                        </Badge>
                        <Badge variant="secondary">
                          Score: {scrambleScore}
                        </Badge>
                      </div>
                      
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-1">
                          {scrambleWords[currentScramble].scrambled}
                        </h3>
                        <p className="text-slate-500">Unscramble the word above</p>
                      </div>
                      
                      <form onSubmit={handleScrambleSubmit} className="flex flex-col items-center gap-4">
                        <Input
                          type="text"
                          value={scrambleInput}
                          onChange={(e) => setScrambleInput(e.target.value)}
                          className="text-center uppercase text-xl max-w-xs"
                          placeholder="Your answer"
                          autoComplete="off"
                        />
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Submit Answer
                        </Button>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Leaderboard Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold mb-4">Community Leaderboard</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              See who's topping the scores in our games and challenges
            </p>
            {!user && (
              <div className="mt-4">
                <Button asChild variant="outline" className="mt-2">
                  <a href="/auth">Sign in to save your scores</a>
                </Button>
              </div>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quiz Leaderboard */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Quiz Leaders</CardTitle>
                  <Brain className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">1</Badge>
                      <span>MasterMind</span>
                    </div>
                    <span className="font-medium">5/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-400">2</Badge>
                      <span>ContentPro</span>
                    </div>
                    <span className="font-medium">4/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-600">3</Badge>
                      <span>CreativeGenius</span>
                    </div>
                    <span className="font-medium">4/5</span>
                  </div>
                  {user && quizCompleted && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">You</span>
                        <span>{user.username}</span>
                      </div>
                      <span className="font-medium">{quizScore}/5</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Memory Leaderboard */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Memory Champions</CardTitle>
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">1</Badge>
                      <span>MemoryMaster</span>
                    </div>
                    <span className="font-medium">7 moves</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-400">2</Badge>
                      <span>BrainTrainer</span>
                    </div>
                    <span className="font-medium">8 moves</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-600">3</Badge>
                      <span>FocusedMind</span>
                    </div>
                    <span className="font-medium">9 moves</span>
                  </div>
                  {user && memoryCompleted && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">You</span>
                        <span>{user.username}</span>
                      </div>
                      <span className="font-medium">{memoryMoves} moves</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Word Scramble Leaderboard */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Word Wizards</CardTitle>
                  <Zap className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">1</Badge>
                      <span>WordNinja</span>
                    </div>
                    <span className="font-medium">5/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-400">2</Badge>
                      <span>SpellingBee</span>
                    </div>
                    <span className="font-medium">5/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-600">3</Badge>
                      <span>ScramblePro</span>
                    </div>
                    <span className="font-medium">4/5</span>
                  </div>
                  {user && scrambleCompleted && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">You</span>
                        <span>{user.username}</span>
                      </div>
                      <span className="font-medium">{scrambleScore}/5</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Rewards Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold mb-4">Earn Rewards</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Play games and complete challenges to earn special rewards and badges
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Unlock Badges</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Trophy className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-sm text-center">Quiz Master</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <Award className="h-8 w-8 text-slate-400" />
                    </div>
                    <span className="text-sm text-center text-slate-400">Memory King</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <Zap className="h-8 w-8 text-slate-400" />
                    </div>
                    <span className="text-sm text-center text-slate-400">Word Wizard</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <Gamepad2 className="h-8 w-8 text-slate-400" />
                    </div>
                    <span className="text-sm text-center text-slate-400">Game Addict</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <Brain className="h-8 w-8 text-slate-400" />
                    </div>
                    <span className="text-sm text-center text-slate-400">Genius</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <Gift className="h-8 w-8 text-slate-400" />
                    </div>
                    <span className="text-sm text-center text-slate-400">Collector</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Member Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Earn badges to display on your profile</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Compete on leaderboards with other members</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Unlock discount codes for the merchandise store</span>
                  </li>
                  <li className="flex items-start text-slate-500">
                    <div className="rounded-full bg-slate-100 p-1 mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Premium members: Access exclusive games</span>
                  </li>
                  <li className="flex items-start text-slate-500">
                    <div className="rounded-full bg-slate-100 p-1 mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Premium members: Monthly prize drawings</span>
                  </li>
                </ul>
                
                {!user ? (
                  <Button asChild className="mt-6 bg-gradient-to-r from-primary to-secondary">
                    <a href="/auth">Sign In to Track Progress</a>
                  </Button>
                ) : user.membershipTier === "free" ? (
                  <Button asChild className="mt-6 bg-gradient-to-r from-primary to-secondary">
                    <a href="/membership">Upgrade for Premium Games</a>
                  </Button>
                ) : (
                  <Button className="mt-6 bg-gradient-to-r from-primary to-secondary">
                    Check Your Rewards
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* More Coming Soon Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-poppins font-bold mb-4">More Games Coming Soon</h2>
          <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto mb-8">
            We're constantly developing new games and challenges for our community
          </p>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl">
              <Gamepad2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Trivia Tournaments</h3>
              <p className="text-slate-600">Compete against other members in live trivia events with prizes</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Knowledge Races</h3>
              <p className="text-slate-600">Test your speed and knowledge in timed challenges</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl">
              <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Puzzle Adventures</h3>
              <p className="text-slate-600">Solve puzzles and riddles in interactive story adventures</p>
            </div>
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <a href="/community">Join Community Discussions</a>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
