
import React from 'react';
import { Search, FileText, PenTool, AlertCircle, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';

interface SearchInfo {
  stages: string[];
  query: string;
  urls: string[];
  error?: string;
}

interface SearchIndicatorProps {
  searchInfo: SearchInfo;
}

const SearchIndicator: React.FC<SearchIndicatorProps> = ({ searchInfo }) => {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'searching':
        return <Search size={16} className="animate-pulse text-emerald-600" />;
      case 'reading':
        return <FileText size={16} className="animate-pulse text-blue-600" />;
      case 'writing':
        return <PenTool size={16} className="animate-pulse text-cyan-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <CheckCircle size={16} className="text-emerald-500" />;
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'searching':
        return 'Searching medical databases...';
      case 'reading':
        return 'Analyzing medical literature...';
      case 'writing':
        return 'Generating evidence-based response...';
      case 'error':
        return 'Search error occurred';
      default:
        return stage;
    }
  };

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50/80 via-cyan-50/80 to-blue-50/80 border border-emerald-200/60 rounded-2xl backdrop-blur-sm shadow-sm">
      {/* Search Query */}
      {searchInfo.query && (
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-emerald-100 rounded-full">
            <Search size={16} className="text-emerald-600" />
          </div>
          <span className="text-sm text-emerald-700 font-medium">
            Searching: "{searchInfo.query}"
          </span>
        </div>
      )}

      {/* Enhanced Stages */}
      <div className="space-y-3">
        {searchInfo.stages.map((stage, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 bg-white/60 rounded-xl">
            <div className="p-1.5 bg-white rounded-full shadow-sm">
              {getStageIcon(stage)}
            </div>
            <span className="text-sm text-gray-700 font-medium">{getStageLabel(stage)}</span>
            {index === searchInfo.stages.length - 1 && stage !== 'error' && (
              <Loader2 size={14} className="animate-spin text-emerald-500 ml-auto" />
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Error */}
      {searchInfo.error && (
        <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-700 font-medium">Error: {searchInfo.error}</span>
          </div>
        </div>
      )}

      {/* Enhanced URLs */}
      {searchInfo.urls && searchInfo.urls.length > 0 && (
        <div className="mt-4 p-3 bg-white/70 rounded-xl border border-gray-200/50">
          <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              <FileText size={14} className="text-blue-600" />
            </div>
            <span>Medical sources consulted:</span>
          </div>
          <div className="space-y-2">
            {searchInfo.urls.slice(0, 3).map((url, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg border border-blue-100/50">
                <ExternalLink size={14} className="text-blue-500 flex-shrink-0" />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 truncate font-medium transition-colors duration-200"
                >
                  {url.length > 55 ? `${url.substring(0, 55)}...` : url}
                </a>
              </div>
            ))}
            {searchInfo.urls.length > 3 && (
              <div className="text-xs text-gray-500 text-center p-2 bg-gray-50/50 rounded-lg">
                +{searchInfo.urls.length - 3} more medical sources
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchIndicator;
