import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';

async function download() {
  const url = 'https://www.youtube.com/watch?v=2zUuSebtwfk';
  const outputPath = path.join(process.cwd(), 'public', 'custom-video.mp4');
  
  console.log(`Starting download of list of formats for: ${url}`);
  console.log(`Output path: ${outputPath}`);

  try {
    const stream = ytdl(url, { 
      filter: format => format.container === 'mp4' && format.hasVideo && format.hasAudio,
      quality: 'highestvideo'
    });
    
    const writeStream = fs.createWriteStream(outputPath);
    
    stream.pipe(writeStream);
    
    writeStream.on('finish', () => {
      console.log('Video downloaded successfully to ' + outputPath);
      process.exit(0);
    });
    
    writeStream.on('error', (err) => {
      console.error('WriteStream error:', err);
      process.exit(1);
    });
    
    stream.on('error', (err) => {
      console.error('Ytdl stream error:', err);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Download failed:', error);
    process.exit(1);
  }
}

download();
