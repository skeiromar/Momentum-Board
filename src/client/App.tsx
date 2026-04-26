import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Home from './pages/Home';
import { LoadingFallback } from './ui/components/loading-fallback';
import { ScrollToTop } from './ui/components/scroll-to-top';
import { ROUTES } from './utilities/constants';

const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
