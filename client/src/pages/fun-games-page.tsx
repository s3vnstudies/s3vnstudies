import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Gift, Award, Brain, Timer, TrendingUp, Check, Trophy } from "lucide-react";

export default function FunGamesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - Fun & Games";
  }, []);

  // Game states
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [puzzleAttempts, setPuzzleAttempts] = useState(0);
  const [memoryGameStarted, setMemoryGameStarted] = useState(false);
  const [memoryGameScore, setMemoryGameScore] = useState(0);

  // Quiz questions
  const quizQuestions = [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Technology Modern Language",
        "Hyperlink and Text Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0
    },
    {
      question: "Which of the following is a JavaScript framework?",
      options: ["Java", "Python", "React", "HTML"],
      correctAnswer: 2
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      correctAnswer: 2
    },
    {
      question: "Which programming language is known as the 'mother of all languages'?",
      options: ["Java", "C", "Python", "JavaScript"],
      correctAnswer: 1
    },
    {
      question: "What is the correct way to declare a JavaScript variable?",
      options: ["v carName;", "variable carName;", "var carName;", "val carName;"],
      correctAnswer: 2
    }
  ];

  // Start quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setQuizCurrentQuestion(0);
    setQuizScore(null);
    setQuizSelectedAnswer(null);
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setQuizSelectedAnswer(answerIndex);
  };

  // Go to next question or finish quiz
  const handleNextQuestion = () => {
    if (quizSelectedAnswer === null) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
      });
      return;
    }

    // Update score if answer is correct
    if (quizSelectedAnswer === quizQuestions[quizCurrentQuestion].correctAnswer) {
      setQuizScore((prev) => (prev === null ? 1 : prev + 1));
    }

    // Move to next question or finish quiz
    if (quizCurrentQuestion < quizQuestions.length - 1) {
      setQuizCurrentQuestion(quizCurrentQuestion + 1);
      setQuizSelectedAnswer(null);
    } else {
      // Quiz finished
      const finalScore = (quizScore === null ? 0 : quizScore) + 
        (quizSelectedAnswer === quizQuestions[quizCurrentQuestion].correctAnswer ? 1 : 0);
      
      // Show completion message
      toast({
        title: "Quiz Completed!",
        description: `You scored ${finalScore} out of ${quizQuestions.length}`,
      });
      
      // Reset quiz
      setQuizStarted(false);
      setQuizScore(finalScore);
    }
  };

  // Handle puzzle guess
  const handlePuzzleGuess = (guess: string) => {
    setPuzzleAttempts(puzzleAttempts + 1);
    
    if (guess.toLowerCase() === "knowledge") {
      setPuzzleSolved(true);
      toast({
        title: "Puzzle Solved!",
        description: "Congratulations! You've solved the puzzle.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try again! You're looking for a 9-letter word.",
        variant: "destructive",
      });
    }
  };

  // Start memory game
  const startMemoryGame = () => {
    setMemoryGameStarted(true);
    setMemoryGameScore(0);
    
    toast({
      title: "Memory Game Started!",
      description: "Match the pairs to earn points.",
    });
  };

  // Leaderboard data
  const leaderboard = [
    { name: "AlexJ", avatar: null, score: 950, rank: 1 },
    { name: "SarahM", avatar: null, score: 875, rank: 2 },
    { name: "MikeW", avatar: null, score: 820, rank: 3 },
    { name: "JessicaL", avatar: null, score: 780, rank: 4 },
    { name: "DavidR", avatar: null, score: 740, rank: 5 }
  ];

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Fun & Games</h1>
            <p className="text-xl mb-8">
              Take a break and enjoy some brain teasers, quizzes, and games to challenge your mind
            </p>
            {!user && (
              <Button asChild className="bg-white text-primary hover:bg-gray-100">
                <a href="/auth">Sign In to Track Your Scores</a>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Games Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="quiz" className="space-y-8">
            <TabsList className="grid grid-cols-3 max-w-lg mx-auto">
              <TabsTrigger value="quiz" className="flex items-center">
                <Brain className="h-4 w-4 mr-2" /> Knowledge Quiz
              </TabsTrigger>
              <TabsTrigger value="puzzle" className="flex items-center">
                <Gift className="h-4 w-4 mr-2" /> Word Puzzle
              </TabsTrigger>
              <TabsTrigger value="memory" className="flex items-center">
                <Award className="h-4 w-4 mr-2" /> Memory Game
              </TabsTrigger>
            </TabsList>
            
            {/* Quiz Game */}
            <TabsContent value="quiz">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>Knowledge Quiz</CardTitle>
                  <CardDescription>
                    Test your knowledge with our quiz. Answer all questions correctly to earn points!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!quizStarted ? (
                    <div className="text-center py-8">
                      <Brain className="h-16 w-16 text-primary/60 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Ready to test your knowledge?</h3>
                      {quizScore !== null && (
                        <div className="mb-6">
                          <Badge className="bg-primary text-lg py-2 px-4">
                            Your last score: {quizScore}/{quizQuestions.length}
                          </Badge>
                        </div>
                      )}
                      <p className="text-gray-600 mb-6">
                        This quiz contains {quizQuestions.length} questions about programming and technology.
                      </p>
                      <Button onClick={startQuiz}>Start Quiz</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between mb-4">
                        <Badge variant="outline" className="text-sm">
                          Question {quizCurrentQuestion + 1} of {quizQuestions.length}
                        </Badge>
                        <Badge className="bg-primary text-sm">
                          Score: {quizScore || 0}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4">
                        {quizQuestions[quizCurrentQuestion].question}
                      </h3>
                      
                      <div className="space-y-3">
                        {quizQuestions[quizCurrentQuestion].options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${
                              quizSelectedAnswer === index ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => handleAnswerSelect(index)}
                          >
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                                quizSelectedAnswer === index ? 'border-primary bg-primary text-white' : ''
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                {quizStarted && (
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => setQuizStarted(false)}>
                      Quit Quiz
                    </Button>
                    <Button onClick={handleNextQuestion}>
                      {quizCurrentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            {/* Word Puzzle */}
            <TabsContent value="puzzle">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>Word Puzzle</CardTitle>
                  <CardDescription>
                    Solve the riddle to reveal the hidden word. Think carefully!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {puzzleSolved ? (
                    <div className="text-center py-8">
                      <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Puzzle Solved!</h3>
                      <p className="text-gray-600 mb-2">
                        Congratulations! You solved the puzzle in {puzzleAttempts} attempts.
                      </p>
                      <p className="text-xl font-bold mb-6">The answer was: KNOWLEDGE</p>
                      <Button onClick={() => {
                        setPuzzleSolved(false);
                        setPuzzleAttempts(0);
                      }}>
                        Try Another Puzzle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6 py-4">
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <h3 className="text-xl font-bold mb-6">Riddle:</h3>
                        <p className="text-lg mb-4 italic">
                          "I grow when shared, yet I diminish when kept to oneself.<br />
                          I am sought after by the curious and feared by the ignorant.<br />
                          I illuminate the darkness and empower the weak.<br />
                          What am I?"
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                          (Hint: I'm a 9-letter word)
                        </p>
                        
                        <div className="flex flex-col items-center space-y-4">
                          <div className="flex space-x-2">
                            {['K', 'N', 'O', 'W', 'L', 'E', 'D', 'G', 'E'].map((letter, index) => (
                              <div key={index} className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center font-bold text-lg">
                                {puzzleSolved ? letter : '?'}
                              </div>
                            ))}
                          </div>
                          
                          {!puzzleSolved && (
                            <div className="mt-6 space-y-4">
                              <input 
                                type="text" 
                                placeholder="Enter your answer" 
                                className="px-4 py-2 border rounded-md w-full max-w-xs"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handlePuzzleGuess((e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }}
                              />
                              <div>
                                <Button 
                                  onClick={() => {
                                    const input = document.querySelector('input') as HTMLInputElement;
                                    handlePuzzleGuess(input.value);
                                    input.value = '';
                                  }}
                                >
                                  Submit Answer
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500">
                          {puzzleAttempts > 0 ? `Attempts: ${puzzleAttempts}` : 'Take your best guess!'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Memory Game */}
            <TabsContent value="memory">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>Memory Game</CardTitle>
                  <CardDescription>
                    Test your memory by matching pairs of cards. Remember the positions and find all matches!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!memoryGameStarted ? (
                    <div className="text-center py-8">
                      <Award className="h-16 w-16 text-primary/60 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Memory Challenge</h3>
                      {memoryGameScore > 0 && (
                        <div className="mb-6">
                          <Badge className="bg-primary text-lg py-2 px-4">
                            Your last score: {memoryGameScore} points
                          </Badge>
                        </div>
                      )}
                      <p className="text-gray-600 mb-6">
                        Flip cards and match pairs to test your memory. Complete the game with fewer moves for a higher score!
                      </p>
                      <Button onClick={startMemoryGame}>Start Game</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between mb-4">
                        <Badge variant="outline" className="text-sm">
                          <Timer className="h-4 w-4 mr-2" /> Time: 00:45
                        </Badge>
                        <Badge className="bg-primary text-sm">
                          Score: {memoryGameScore}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 16 }).map((_, index) => (
                          <div 
                            key={index} 
                            className="aspect-square bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition flex items-center justify-center"
                            onClick={() => {
                              // In a real implementation, this would handle card flipping and matching
                              setMemoryGameScore(memoryGameScore + 10);
                            }}
                          >
                            <span className="text-2xl">?</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500">
                          Click on a card to flip it and find matching pairs
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                {memoryGameStarted && (
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => setMemoryGameStarted(false)}>
                      Quit Game
                    </Button>
                    <Button variant="destructive" onClick={() => setMemoryGameStarted(false)}>
                      Restart Game
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Leaderboard Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Leaderboard</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" /> Top Performers
                </CardTitle>
                <CardDescription>
                  The highest-scoring community members across all games
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center space-x-4">
                      <div className="w-10 text-center font-bold text-lg">
                        {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{player.name}</div>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                        <span className="font-bold">{player.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {user ? (
                  <div className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 text-center font-bold text-lg">
                      #42
                    </div>
                    <Avatar className="h-10 w-10 mx-4">
                      <AvatarFallback>{user.displayName?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.displayName || user.username}</div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold">320</span>
                    </div>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <a href="/auth">Sign In to Compete</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Benefits of Brain Games</h2>
            <p className="text-gray-600 mb-12">
              Regular mental exercises can have profound positive effects on your cognitive abilities
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Improves Memory</h3>
                <p className="text-gray-600">
                  Regular brain exercises help strengthen your memory and recall abilities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Enhances Focus</h3>
                <p className="text-gray-600">
                  Brain games can help improve concentration and attention to detail.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Boosts Creativity</h3>
                <p className="text-gray-600">
                  Puzzles and word games stimulate creative thinking and problem-solving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Challenge Yourself?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community and unlock more games, track your progress, and compete with others!
          </p>
          
          {user ? (
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => document.getElementById("quiz-tab")?.click()}
            >
              Play More Games
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <a href="/auth">Join the Community</a>
            </Button>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
