'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  Target, 
  Lightbulb, 
  Users, 
  Mail, 
  MessageSquare, 
  Send as SendIcon, 
  Bell,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

type FlowState = 'welcome' | 'goals' | 'strategy' | 'audience' | 'channels' | 'timeline' | 'briefs' | 'copy' | 'review'

interface AudienceSegment {
  name: string
  size: string
  status: 'selected' | 'optional'
}

interface ChannelData {
  name: string
  percentage: number
  icon: React.ReactNode
}

interface CampaignCanvasProps {
  flowState: FlowState
}

export function CampaignCanvas({ flowState }: CampaignCanvasProps) {
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Determine which nodes to show based on flow state
  const showGoal = flowState !== 'welcome'
  const showStrategy = ['strategy', 'audience', 'channels', 'timeline', 'briefs', 'copy', 'review'].includes(flowState)
  const showAudience = ['audience', 'channels', 'timeline', 'briefs', 'copy', 'review'].includes(flowState)
  const showChannels = ['channels', 'timeline', 'briefs', 'copy', 'review'].includes(flowState)
  const showTimeline = ['timeline', 'briefs', 'copy', 'review'].includes(flowState)

  const audienceSegments: AudienceSegment[] = [
    { name: 'VIP Loyalists', size: '42K members', status: 'selected' },
    { name: 'Lapsed Loyalists', size: '38K members', status: 'selected' },
    { name: 'Rising Stars', size: '25K members', status: 'optional' },
  ]

  const channels: ChannelData[] = [
    { name: 'Email', percentage: 45, icon: <Mail className="h-3 w-3" /> },
    { name: 'Paid Social', percentage: 30, icon: <MessageSquare className="h-3 w-3" /> },
    { name: 'SMS', percentage: 20, icon: <SendIcon className="h-3 w-3" /> },
    { name: 'Push', percentage: 5, icon: <Bell className="h-3 w-3" /> },
  ]

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 1.5))
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5))
  const handleFitToView = () => setZoom(1)

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#141024] via-[#1A1532] to-[#1E1E2E]">
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4 text-white" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4 text-white" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
          onClick={handleFitToView}
        >
          <Maximize2 className="h-4 w-4 text-white" />
        </Button>
      </div>

      {/* Canvas Content */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Welcome State - Empty Canvas */}
        {flowState === 'welcome' && (
          <div className="text-center space-y-4">
            <div className="h-20 w-20 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Target className="h-10 w-10 text-white/40" />
            </div>
            <p className="text-white/60 text-lg font-medium">
              Your campaign will appear here
            </p>
          </div>
        )}

        {/* Campaign Visualization */}
        {flowState !== 'welcome' && (
          <div className="relative w-full max-w-4xl">
            {/* SVG for Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '600px' }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(163,122,252,0.3)" />
                </linearGradient>
              </defs>
              
              {/* Goal to Strategy */}
              <line x1="50%" y1="80" x2="50%" y2="160" stroke="url(#lineGradient)" strokeWidth="2" />
              
              {/* Strategy to Audiences */}
              <path
                d="M 50% 240 Q 50% 270, 25% 300"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <path
                d="M 50% 240 L 50% 300"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <path
                d="M 50% 240 Q 50% 270, 75% 300"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              
              {/* Audiences to Channel Mix */}
              <line x1="25%" y1="400" x2="50%" y2="460" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="50%" y1="400" x2="50%" y2="460" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="75%" y1="400" x2="50%" y2="460" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              
              {/* Channel Mix to Timeline */}
              <line x1="50%" y1="540" x2="50%" y2="600" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            </svg>

            {/* Goal Node */}
            <div className="flex justify-center mb-8">
              <Card
                className={cn(
                  "relative px-6 py-4 bg-white cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-white/20 border-0",
                  selectedNode === 'goal' && "ring-2 ring-white shadow-xl shadow-white/30"
                )}
                onClick={() => setSelectedNode('goal')}
                style={{
                  boxShadow: '0 0 20px rgba(255,255,255,0.15)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Goal</div>
                    <div className="text-base font-semibold text-foreground">+20% Holiday Revenue</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Strategy Node */}
            {showStrategy && (
              <div className="flex justify-center mb-8">
                <Card
                  className={cn(
                    "relative px-6 py-4 bg-white/95 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20",
                    "border-2 border-[#A37AFC]",
                    selectedNode === 'strategy' && "ring-2 ring-[#A37AFC] shadow-lg shadow-purple-500/30"
                  )}
                  onClick={() => setSelectedNode('strategy')}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Strategy</div>
                        <div className="text-base font-semibold text-foreground">Tiered Exclusivity</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        85% Confidence
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Audience Nodes */}
            {showAudience && (
              <div className="flex justify-center gap-4 mb-8">
                {audienceSegments.map((segment, idx) => (
                  <Card
                    key={segment.name}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-all duration-200 hover:shadow-lg",
                      segment.status === 'selected' 
                        ? "bg-white border-2 border-blue-400 shadow-md hover:shadow-blue-400/30" 
                        : "bg-white/80 border-2 border-dashed border-white/40 hover:border-white/60",
                      selectedNode === `audience-${idx}` && "ring-2 ring-blue-400"
                    )}
                    onClick={() => setSelectedNode(`audience-${idx}`)}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        segment.status === 'selected' ? "bg-blue-500" : "bg-gray-300"
                      )}>
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{segment.name}</div>
                        <div className="text-xs text-muted-foreground">{segment.size}</div>
                        <Badge 
                          variant={segment.status === 'selected' ? 'default' : 'outline'} 
                          className="mt-1 text-xs"
                        >
                          {segment.status === 'selected' ? 'Selected' : 'Optional'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Channel Mix Node */}
            {showChannels && (
              <div className="flex justify-center mb-8">
                <Card
                  className={cn(
                    "w-full max-w-2xl px-6 py-4 bg-white/95 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-lg",
                    selectedNode === 'channels' && "ring-2 ring-primary shadow-lg"
                  )}
                  onClick={() => setSelectedNode('channels')}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Channel Mix</div>
                      <div className="text-sm font-semibold text-foreground">$125K Budget</div>
                    </div>
                    <div className="space-y-2">
                      {channels.map((channel) => (
                        <div key={channel.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground">{channel.icon}</div>
                              <span className="font-medium text-foreground">{channel.name}</span>
                            </div>
                            <span className="font-semibold text-foreground">{channel.percentage}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                              style={{ width: `${channel.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Timeline Node */}
            {showTimeline && (
              <div className="flex justify-center">
                <Card
                  className={cn(
                    "w-full max-w-2xl px-6 py-4 bg-white/95 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-lg",
                    selectedNode === 'timeline' && "ring-2 ring-primary shadow-lg"
                  )}
                  onClick={() => setSelectedNode('timeline')}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timeline</div>
                      <div className="text-sm font-semibold text-foreground">$125K Budget</div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-foreground">Nov 15</span>
                          <span className="font-medium text-foreground">Dec 24</span>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div className="absolute inset-0 flex">
                            <div className="h-full bg-blue-500 flex items-center justify-center" style={{ width: '33.33%' }}>
                              <span className="text-[8px] font-bold text-white uppercase tracking-wider">Awareness</span>
                            </div>
                            <div className="h-full bg-purple-500 flex items-center justify-center" style={{ width: '33.33%' }}>
                              <span className="text-[8px] font-bold text-white uppercase tracking-wider">Engage</span>
                            </div>
                            <div className="h-full bg-green-500 flex items-center justify-center" style={{ width: '33.33%' }}>
                              <span className="text-[8px] font-bold text-white uppercase tracking-wider">Convert</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>6-week campaign</span>
                      <span>3 phases</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/90">
            <span className="font-medium">Campaign Assets:</span>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              4 emails
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              6-week paid social
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              2 SMS
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              2 push
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-white/90">
              <span className="text-white/60">Predicted Revenue:</span>
              <span className="ml-2 font-semibold text-green-400">$1.8M</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-white/90">
              <span className="text-white/60">ROAS:</span>
              <span className="ml-2 font-semibold text-green-400">3.6x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
