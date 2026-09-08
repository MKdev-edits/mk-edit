// src/pages/LandingPage.jsx
import { useState } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingPurpose from '../components/landing/LandingPurpose';
import LandingPerk from '../components/landing/LandingPerk';
import LandingFAQ from '../components/landing/LandingFAQ';
import ClaimModal from '../components/landing/ClaimModal';

export default function LandingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <LandingNavbar onOpenModal={() => setIsModalOpen(true)} />
            <LandingHero onOpenModal={() => setIsModalOpen(true)} />
            <LandingFeatures />
            <LandingPurpose />
            <LandingPerk onOpenModal={() => setIsModalOpen(true)} />
            <LandingFAQ />

            {/* ✅ Modal */}
            <ClaimModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}