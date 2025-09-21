/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "https://3000-firebase-veterinariamagali-1756387044438.cluster-hkcruqmgzbd2aqcdnktmz6k7ba.cloudworkstations.dev",
      "https://firebase-veterinariamagali-1756387044438.cluster-hkcruqmgzba.cloudworkstations.dev"
    ]
  },
 images: {
   domains: ['placedog.net', 'loremflickr.com'], // Añadido loremflickr.com
 },
};

export default nextConfig;
