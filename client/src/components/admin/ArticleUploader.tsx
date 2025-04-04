import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function ArticleUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/zip' && !selectedFile.name.endsWith('.zip')) {
        toast({
          title: 'Invalid file format',
          description: 'Please upload a ZIP file containing your articles.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a ZIP file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/admin/articles/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type here as it will be automatically set by the browser with the correct boundary for FormData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Upload successful',
          description: `${result.articlesImported} articles imported successfully.`,
        });
        
        // Reset the file input
        setFile(null);
        
        // Invalidate the articles query cache to refresh the list
        queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      } else {
        throw new Error(result.message || 'Failed to upload articles');
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Articles</CardTitle>
        <CardDescription>
          Upload a ZIP file containing article files and images to add them to your site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
            <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Drag and drop a ZIP file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                ZIP files should contain markdown (.md) or HTML (.html) files with frontmatter for article metadata
              </p>
            </div>
            
            <div className="mt-4 w-full max-w-xs">
              <Label htmlFor="file-upload" className="sr-only">
                Choose file
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>
          
          {file && (
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <UploadCloud className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Uploading and processing... {uploadProgress}%
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Articles"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}