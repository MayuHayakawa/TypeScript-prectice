import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';

const inter = Inter({ subsets: ['latin'] })

interface SearchCatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface IndexImageProps {
  initialCatImageUrl: string;
}

const fetchCatImage = async (): Promise<SearchCatImage> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await res.json();
  // console.log(result);
  return result[0];
}
const Home: NextPage<IndexImageProps> = ({ initialCatImageUrl }) => {
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);


  const handleClick = async () => {
    const catImage = await fetchCatImage();
    // console.log(catImage.url);
    setCatImageUrl(catImage.url);
  }

  return (
    <div 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Cat image app</h1>
      <img 
        src={catImageUrl} 
        width={500}
        height="auto"
      />
      <button 
        style={{marginTop: "18"}}
        onClick={handleClick}
      >
        Todays cat
      </button>
    </div>
  )
}

//SSR: Server Side Rendering
export const getServerSideProps: GetServerSideProps<IndexImageProps> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImageUrl: catImage.url,
    }
  }
}

export default Home;