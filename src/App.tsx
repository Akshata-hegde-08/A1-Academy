import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CyclePage } from './pages/CyclePage';
import { SubjectPage } from './pages/SubjectPage';
import { ResourceCategoryPage } from './pages/ResourceCategoryPage';
import { UnitResourcesPage } from './pages/UnitResourcesPage';
import { StudyTipsPage } from './pages/StudyTipsPage';
import { CgpaCalculatorPage } from './pages/CgpaCalculatorPage';
import { SubjectsDirectoryPage } from './pages/SubjectsDirectoryPage';
import { ResourcesHubPage } from './pages/ResourcesHubPage';
import { LabsPage } from './pages/LabsPage';
import { LabDetailPage } from './pages/LabDetailPage';
import { LabTopicPage } from './pages/LabTopicPage';
import { LabCompleteViewPage } from './pages/LabCompleteViewPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { ReferenceMaterialPage } from './pages/ReferenceMaterialPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Dedicated Cycle Pages */}
            <Route
              path="/physics-cycle"
              element={<CyclePage cycleSlug="physics-cycle" />}
            />
            <Route
              path="/chemistry-cycle"
              element={<CyclePage cycleSlug="chemistry-cycle" />}
            />

            {/* Global Navigation Menu Pages */}
            <Route path="/subjects" element={<SubjectsDirectoryPage />} />
            <Route path="/resources" element={<ResourcesHubPage />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/labs/:labSlug" element={<LabDetailPage />} />
            <Route
              path="/labs/:labSlug/complete-record"
              element={<LabCompleteViewPage mode="complete-record" />}
            />
            <Route
              path="/labs/:labSlug/viva-questions"
              element={<LabCompleteViewPage mode="viva-questions" />}
            />
            <Route path="/labs/:labSlug/:topicSlug" element={<LabTopicPage />} />
            <Route path="/question-bank" element={<QuestionBankPage />} />
            <Route
              path="/reference-material"
              element={<ReferenceMaterialPage />}
            />
            <Route path="/study-tips" element={<StudyTipsPage />} />
            <Route path="/cgpa-calculator" element={<CgpaCalculatorPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Individual Subject, Unit & Resource Category Routes */}
            <Route path="/:cycleSlug/:subjectSlug" element={<SubjectPage />} />
            <Route
              path="/:cycleSlug/:subjectSlug/unit/:unitNumber"
              element={<UnitResourcesPage />}
            />
            <Route
              path="/:cycleSlug/:subjectSlug/unit/:unitNumber/:categorySlug"
              element={<UnitResourcesPage />}
            />
            <Route
              path="/:cycleSlug/:subjectSlug/:categorySlug"
              element={<ResourceCategoryPage />}
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
