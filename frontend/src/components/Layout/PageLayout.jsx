import React from 'react';

const PageLayout = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  headerActions,
  className = ""
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className={`max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 ${className}`}>
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
          <div className="relative flex justify-between items-start">
            <div>
              <div className="flex items-center mb-3">
                {Icon && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
                    <Icon className="text-white text-xl" />
                  </div>
                )}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
              </div>
              {subtitle && (
                <p className="text-gray-600 text-lg">{subtitle}</p>
              )}
            </div>
            {headerActions && (
              <div className="flex gap-3">
                {headerActions}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default PageLayout;