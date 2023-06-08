import './style.css';
import Experience from './Experience/Experience';
import { inject } from '@vercel/analytics';

window.experience = new Experience(document.getElementById('canvas'));

// vercel analytics
inject();
