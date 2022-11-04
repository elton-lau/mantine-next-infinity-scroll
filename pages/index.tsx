import { useEffect, useState } from 'react';
import { createStyles, Loader, Title, Image } from '@mantine/core';
import { useListState, useWindowEvent } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  title: {
    marginTop: '25px',
    marginBottom: '15px',
    letterSpacing: '5px',

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: '20px',
    },
  },
  loader: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.8)',

    '& > svg': {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
  imageContainer: {
    margin: '10px 30%',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      margin: '10px',
    },
  },
  image: {
    width: '100%',
    marginTop: '5px',
  },
}));

const count = 10;
const apiKey = process.env.NEXT_PUBLIC_APIKEY;
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const { classes } = useStyles();

  // Get photos from Unsplash API
  const getPhotos = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      // TODO: spread syntax on data and use mantine hook
      setPhotos([...photos, ...data]);
      setLoading(false);
    } catch (err) {
      // catch error
    }
  };

  useEffect(() => {
    getPhotos();
  }, []);

  useWindowEvent('scroll', () => {
    if (window.innerHeight + window.scrollY > document.body.offsetHeight - 1000 && !loading) {
      setLoading(true);
      getPhotos();
    }
  });

  return (
    <div>
      <Title order={1} className={classes.title} align="center" size={40}>
        Infinite Scroll
      </Title>
      {loading && (
        <div className={classes.loader}>
          <Loader />
        </div>
      )}
      {!loading && (
        <div className={classes.imageContainer}>
          {photos.map((p, index) => (
            <a href={p.links.html} target="_blank" key={index} rel="noreferrer">
              <Image
                className={classes.image}
                src={p.urls.regular}
                alt={p.alt_description}
                title={p.alt_description}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
