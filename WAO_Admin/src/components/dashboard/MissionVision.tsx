import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Eye, ExternalLink, Heart, Users, Shield, Lightbulb } from 'lucide-react';
import { api } from '@/lib/api';

const MissionVision = () => {
  const [missionVision, setMissionVision] = useState({
    mission: '',
    vision: '',
    lastUpdated: '',
    source: 'website',
    missionPoints: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissionVision();
  }, []);

  const loadMissionVision = async () => {
    try {
      const response = await api.getMissionVision();
      
      if (response.success && response.data) {
        setMissionVision(response.data);
      }
    } catch (error) {
      console.error('❌ Failed to load mission/vision:', error);
      // Fallback content from website
      setMissionVision({
        mission: "To provide comprehensive mental health support, foster community connections, and create safe spaces for healing and growth through accessible resources, peer support, and professional guidance.",
        vision: "A world where mental health is prioritized, stigma is eliminated, and every individual has access to the support they need to thrive emotionally, mentally, and socially.",
        lastUpdated: new Date().toLocaleDateString(),
        source: 'website',
        missionPoints: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getMissionIcon = (title: string) => {
    switch (title) {
      case 'Support & Community': return Heart;
      case 'Education & Awareness': return Lightbulb;
      case 'Advocacy & Policy Change': return Shield;
      case 'Peer Mentorship': return Users;
      default: return Target;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission Statement */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-lg">Our Mission</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {missionVision.source === 'website' ? 'From Website' : 'Local'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open('https://weareone.co.ke/#mission', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              What drives us forward every day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              {missionVision.mission}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Last updated: {missionVision.lastUpdated}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-600 hover:text-orange-700"
                onClick={() => window.open('https://weareone.co.ke/#mission', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View on Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vision Statement */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Our Vision</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {missionVision.source === 'website' ? 'From Website' : 'Local'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open('https://weareone.co.ke/#about', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              The future we are working towards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              {missionVision.vision}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Last updated: {missionVision.lastUpdated}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700"
                onClick={() => window.open('https://weareone.co.ke/#about', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View on Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mission Points from Website */}
      {missionVision.missionPoints && missionVision.missionPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              Mission Focus Areas
            </CardTitle>
            <CardDescription>
              Key areas of our organizational mission from the main website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {missionVision.missionPoints.map((point: any, index: number) => {
                const IconComponent = getMissionIcon(point.title);
                return (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                      <IconComponent className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{point.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MissionVision;