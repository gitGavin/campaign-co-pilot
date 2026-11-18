'use client'

import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'; // Import Send icon

import { ScrollArea } from "@/components/ui/scroll-area"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChatInterface } from '@/components/chat-interface'
import { CampaignCanvas } from '@/components/campaign-canvas'
import { 
  Sparkles, 
  ChevronLeft, 
  Check, 
  Circle, 
  Loader2,
  Plus,
  Menu
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type AgentStatus = 'complete' | 'working' | 'pending'
type FlowState = 'welcome' | 'goals' | 'strategy' | 'audience' | 'channels' | 'timeline' | 'briefs' | 'copy' | 'review'

interface Agent {
  name: string
  status: AgentStatus
}

interface CampaignStep {
  name: string
  flowState: FlowState
  isComplete: boolean
  isCurrent: boolean
}

export default function CampaignCoPilot() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [message, setMessage] = useState('') // Declare message state
  const [flowState, setFlowState] = useState<FlowState>('welcome')

  // Determine agent status based on flow state
  const agents: Agent[] = [
    { 
      name: 'Strategy Agent', 
      status: flowState === 'strategy' ? 'working' : ['audience', 'channels', 'timeline', 'briefs', 'copy', 'review'].includes(flowState) ? 'complete' : 'pending' 
    },
    { 
      name: 'Audience Agent', 
      status: flowState === 'audience' ? 'working' : ['channels', 'timeline', 'briefs', 'copy', 'review'].includes(flowState) ? 'complete' : 'pending' 
    },
    { 
      name: 'Channel Agent', 
      status: flowState === 'channels' || flowState === 'timeline' ? 'working' : ['briefs', 'copy', 'review'].includes(flowState) ? 'complete' : 'pending' 
    },
    { 
      name: 'Creative Agent', 
      status: ['briefs', 'copy'].includes(flowState) ? 'working' : flowState === 'review' ? 'complete' : 'pending' 
    },
  ]

  // Determine campaign step completion based on flow state
  const campaignSteps: CampaignStep[] = [
    {
      name: 'Goals',
      flowState: 'goals',
      isComplete: flowState !== 'welcome' && flowState !== 'goals',
      isCurrent: flowState === 'goals'
    },
    {
      name: 'Strategy',
      flowState: 'strategy',
      isComplete: ['audience', 'channels', 'timeline', 'briefs', 'copy', 'review'].includes(flowState),
      isCurrent: flowState === 'strategy'
    },
    {
      name: 'Audience',
      flowState: 'audience',
      isComplete: ['channels', 'timeline', 'briefs', 'copy', 'review'].includes(flowState),
      isCurrent: flowState === 'audience'
    },
    {
      name: 'Channels',
      flowState: 'channels',
      isComplete: ['timeline', 'briefs', 'copy', 'review'].includes(flowState),
      isCurrent: flowState === 'channels'
    },
    {
      name: 'Briefs',
      flowState: 'briefs',
      isComplete: ['copy', 'review'].includes(flowState),
      isCurrent: flowState === 'briefs'
    },
    {
      name: 'Creative',
      flowState: 'copy',
      isComplete: flowState === 'review',
      isCurrent: flowState === 'copy'
    },
    {
      name: 'Review',
      flowState: 'review',
      isComplete: false,
      isCurrent: flowState === 'review'
    },
  ]

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case 'complete':
        return <Check className="h-4 w-4 text-primary" />
      case 'working':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />
      case 'pending':
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Left Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-0 md:w-20' : 'w-full md:w-[280px]'
        } ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative z-40 h-full bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="flex-1 overflow-hidden flex flex-col">
          {!sidebarCollapsed && (
            <>
              {/* Sidebar Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="font-serif font-semibold text-lg text-foreground">
                      Campaign Co-Pilot
                    </span>
                  )}
                </div>

                {/* Agents Section */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Agents
                  </h3>
                  <div className="space-y-3">
                    {agents.map((agent, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="flex-shrink-0">
                          {getStatusIcon(agent.status)}
                        </div>
                        <span className={agent.status === 'working' ? 'text-foreground font-medium' : 'text-foreground'}>
                          {agent.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Campaign Progress Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Campaign Progress
                  </h3>
                  <div className="space-y-2">
                    {campaignSteps.map((step, index) => (
                      <button
                        key={index}
                        onClick={() => setFlowState(step.flowState)}
                        className={`w-full flex items-center gap-3 text-sm py-2 px-3 rounded-lg transition-colors cursor-pointer hover:bg-primary/5 ${
                          step.isCurrent
                            ? 'bg-primary/10 text-primary font-medium'
                            : step.isComplete
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span className="text-xs font-mono w-4">
                          {index + 1}.
                        </span>
                        <span className="flex-1 text-left">{step.name}</span>
                        {step.isComplete && (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Collapse Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`}
            />
            {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4 md:gap-0">
            <div className="md:hidden h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif font-semibold text-lg text-foreground md:hidden">
              Campaign Co-Pilot
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Campaign</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Split Main Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel - Chat Interface */}
          <div className="flex-1 lg:w-[40%] flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-background">
            <ChatInterface flowState={flowState} onFlowStateChange={setFlowState} />
          </div>

          {/* Right Panel - Canvas */}
          <div className="flex-1 lg:w-[60%] relative overflow-hidden">
            <CampaignCanvas flowState={flowState} />
          </div>
        </div>
      </div>
    </div>
  )
}
