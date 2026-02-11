import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { 
  BarChart3, 
  Globe, 
  Network, 
  Shield, 
  TrendingUp, 
  FileText,
  Settings,
  Download,
  Eye,
  Code
} from 'lucide-react';

// Component metadata
const componentMetadata = {
  CoverPage: {
    name: "Cover Page",
    description: "Professional report cover with client information",
    icon: FileText,
    category: "Layout",
    features: ["Client branding", "Date display", "Assessment ID"]
  },
  DocumentControl: {
    name: "Document Control",
    description: "Version and document management information",
    icon: Settings,
    category: "Layout",
    features: ["Version tracking", "Classification", "Change history"]
  },
  TableOfContents: {
    name: "Table of Contents",
    description: "Interactive navigation through report sections",
    icon: FileText,
    category: "Navigation",
    features: ["Auto-generated", "Page numbers", "Direct links"]
  },
  ExecutiveSummary: {
    name: "Executive Summary",
    description: "High-level overview with key metrics and visualizations",
    icon: BarChart3,
    category: "Analytics",
    features: ["Risk scoring", "Vulnerability metrics", "Executive dashboard"]
  },
  ScopeMethodology: {
    name: "Scope & Methodology",
    description: "Assessment scope, tools, and testing approach",
    icon: Shield,
    category: "Methodology",
    features: ["IP ranges", "Tool inventory", "Testing timeline"]
  },
  RiskDashboard: {
    name: "Risk Dashboard",
    description: "Comprehensive risk visualizations and matrices",
    icon: BarChart3,
    category: "Analytics",
    features: ["Risk matrix", "Category charts", "Trend analysis"]
  },
  NetworkArchitecture: {
    name: "Network Architecture",
    description: "Network topology and asset inventory",
    icon: Network,
    category: "Infrastructure",
    features: ["Subnet breakdown", "Asset inventory", "Network diagrams"]
  },
  GeoThreatIntel: {
    name: "Geographical Threat Intelligence",
    description: "Global threat mapping and attack origins",
    icon: Globe,
    category: "Threat Intel",
    features: ["World map", "Attack origins", "Threat levels"]
  },
  DetailedFindings: {
    name: "Detailed Findings",
    description: "Comprehensive vulnerability analysis",
    icon: Shield,
    category: "Findings",
    features: ["CVSS scores", "Evidence", "Remediation steps"]
  },
  VulnTrending: {
    name: "Vulnerability Trending",
    description: "Vulnerability trends and analytics",
    icon: TrendingUp,
    category: "Analytics",
    features: ["Trend charts", "Patch status", "Risk exposure"]
  },
  ComplianceMapping: {
    name: "Compliance Mapping",
    description: "Regulatory compliance analysis",
    icon: FileText,
    category: "Compliance",
    features: ["Framework mapping", "Compliance scores", "Control analysis"]
  },
  HostSummary: {
    name: "Host Summary",
    description: "Detailed host and system analysis",
    icon: Network,
    category: "Infrastructure",
    features: ["Host details", "Service analysis", "Risk ratings"]
  },
  MermaidDiagram: {
    name: "Mermaid Diagrams",
    description: "Interactive system architecture diagrams",
    icon: Code,
    category: "Visualization",
    features: ["Custom diagrams", "Themed styling", "PDF export"]
  },
  EntityGraph: {
    name: "Entity Relationship Graph",
    description: "Interactive entity correlation analysis with red theme",
    icon: Network,
    category: "Analytics",
    features: ["Force-directed layout", "Risk visualization", "Connection analysis", "PDF optimized"]
  },
  RemediationRoadmap: {
    name: "Remediation Roadmap",
    description: "Prioritized remediation planning",
    icon: TrendingUp,
    category: "Remediation",
    features: ["Timeline planning", "Priority matrix", "Effort estimation"]
  },
  Appendices: {
    name: "Appendices",
    description: "Additional reference materials",
    icon: FileText,
    category: "Reference",
    features: ["Glossary", "References", "Technical details"]
  }
};

interface ReportBuilderProps {
  config: any;
  onConfigChange: (config: any) => void;
  onPreview: () => void;
  onGenerate: () => void;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({ 
  config, 
  onConfigChange, 
  onPreview, 
  onGenerate 
}) => {
  const handleComponentToggle = (componentName: string, enabled: boolean) => {
    const updatedComponents = config.components.map((comp: any) =>
      comp.name === componentName ? { ...comp, enabled } : comp
    );
    onConfigChange({ ...config, components: updatedComponents });
  };

  const handleComponentOrder = (componentName: string, direction: 'up' | 'down') => {
    const components = [...config.components];
    const index = components.findIndex((comp: any) => comp.name === componentName);
    
    if (direction === 'up' && index > 0) {
      [components[index], components[index - 1]] = [components[index - 1], components[index]];
    } else if (direction === 'down' && index < components.length - 1) {
      [components[index], components[index + 1]] = [components[index + 1], components[index]];
    }
    
    // Reassign order numbers
    components.forEach((comp, i) => {
      comp.order = i + 1;
    });
    
    onConfigChange({ ...config, components });
  };

  const handleMetaChange = (field: string, value: string) => {
    onConfigChange({
      ...config,
      meta: { ...config.meta, [field]: value }
    });
  };

  const categories = Array.from(new Set(
    Object.values(componentMetadata).map((meta: any) => meta.category)
  ));

  const enabledComponents = config.components.filter((comp: any) => comp.enabled).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Builder</h1>
            <p className="text-muted-foreground mt-1">
              Customize your security assessment report with interactive components
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={onGenerate}>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Report Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={config.meta.client}
                  onChange={(e) => handleMetaChange('client', e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="assessmentId">Assessment ID</Label>
                <Input
                  id="assessmentId"
                  value={config.meta.assessmentId}
                  onChange={(e) => handleMetaChange('assessmentId', e.target.value)}
                  placeholder="Enter assessment ID"
                />
              </div>
              <div>
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input
                  id="reportTitle"
                  value={config.meta.reportTitle}
                  onChange={(e) => handleMetaChange('reportTitle', e.target.value)}
                  placeholder="Enter report title"
                />
              </div>
              <div>
                <Label htmlFor="classification">Classification</Label>
                <Input
                  id="classification"
                  value={config.meta.classification}
                  onChange={(e) => handleMetaChange('classification', e.target.value)}
                  placeholder="Enter classification level"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={config.meta.subtitle}
                onChange={(e) => handleMetaChange('subtitle', e.target.value)}
                placeholder="Enter report subtitle"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Component Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Report Components
              </div>
              <Badge variant="secondary">
                {enabledComponents} of {config.components.length} enabled
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(componentMetadata)
                      .filter(([_, meta]: [string, any]) => meta.category === category)
                      .map(([componentName, metadata]: [string, any]) => {
                        const component = config.components.find((c: any) => c.name === componentName);
                        const Icon = metadata.icon;
                        
                        return (
                          <Card 
                            key={componentName} 
                            className={`transition-all duration-200 ${
                              component?.enabled 
                                ? 'ring-2 ring-primary border-primary' 
                                : 'opacity-60'
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Icon className="w-5 h-5 text-primary" />
                                  <div>
                                    <h4 className="font-semibold text-sm">{metadata.name}</h4>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      Order: {component?.order || 0}
                                    </Badge>
                                  </div>
                                </div>
                                <Switch
                                  checked={component?.enabled || false}
                                  onCheckedChange={(enabled) => handleComponentToggle(componentName, enabled)}
                                />
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-3">
                                {metadata.description}
                              </p>
                              
                              {component?.enabled && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleComponentOrder(componentName, 'up')}
                                    disabled={component.order <= 1}
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleComponentOrder(componentName, 'down')}
                                    disabled={component.order >= config.components.length}
                                  >
                                    ↓
                                  </Button>
                                </div>
                              )}
                              
                              <div className="mt-3 flex flex-wrap gap-1">
                                {metadata.features.map((feature: string) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={config.theme?.primaryColor || '#44AC96'}
                  onChange={(e) => onConfigChange({
                    ...config,
                    theme: { ...config.theme, primaryColor: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={config.theme?.secondaryColor || '#0A1628'}
                  onChange={(e) => onConfigChange({
                    ...config,
                    theme: { ...config.theme, secondaryColor: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <select
                  id="fontFamily"
                  className="w-full p-2 border rounded"
                  value={config.theme?.fontFamily || 'IBM Plex Sans'}
                  onChange={(e) => onConfigChange({
                    ...config,
                    theme: { ...config.theme, fontFamily: e.target.value }
                  })}
                >
                  <option value="IBM Plex Sans">IBM Plex Sans</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportBuilder;
