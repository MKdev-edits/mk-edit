// src/pages/LandingPage.jsx
import '../App.css';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingDemo from '../components/landing/LandingDemo';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingPurpose from '../components/landing/LandingPurpose';
import LandingPricing from '../components/landing/LandingPricing';
import SectionDivider from '../components/landing/SectionDivider';

export default function LandingPage() {
    return (
        <div className="landing-theme min-h-screen bg-[#0A0A0F]">
            <div className="landing-noise" aria-hidden="true" />

            <LandingNavbar />

            <LandingHero />

            <SectionDivider />
            <LandingDemo />

            <SectionDivider />
            <LandingFeatures />

            <SectionDivider />
            <LandingPurpose />

            <SectionDivider />
            <LandingPricing />
        </div>
    );
}