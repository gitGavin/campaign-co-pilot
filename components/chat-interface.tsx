'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Send, ChevronDown, ChevronUp, Pencil, ArrowLeft, ArrowRight, Calendar, Check } from 'lucide-react'
import { AudienceSegmentCards } from '@/components/audience-segment-cards'
import { ChannelPlanning } from '@/components/channel-planning'
import { CampaignTimeline } from '@/components/campaign-timeline'
import { ConnectedBriefs } from '@/components/connected-briefs'
import { CopyGeneration } from '@/components/copy-generation'
import { CampaignReview } from '@/components/campaign-review'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type FlowState = 'welcome' | 'goals' | 'strategy' | 'audience' | 'channels' | 'timeline' | 'briefs' | 'copy' | 'review'

// Section Divider Component
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// Agent Handoff Indicator Component
function AgentHandoff({ agentName }: { agentName: string }) {
  return (
    <div className="flex justify-center my-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
        <span className="text-sm">👥</span>
        <span className="text-xs font-medium text-accent">
          {agentName} is now active
        </span>
      </div>
    </div>
  )
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp?: string
  thinking?: boolean
  thinkingSteps?: string[]
  thinkingAgent?: string
  reasoning?: string
  confidence?: number
  actionButtons?: { label: string; variant?: 'default' | 'outline'; action?: string }[]
  quickReplies?: string[]
}

interface CampaignParams {
  goal: string
  target: string
  timeline: string
  budget: string
}

interface ChatInterfaceProps {
  flowState: FlowState
  onFlowStateChange: (state: FlowState) => void
}

export function ChatInterface({ flowState, onFlowStateChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null)
  const [campaignParams, setCampaignParams] = useState<CampaignParams | null>(null)
  const [showWelcome, setShowWelcome] = useState(true) // Declare showWelcome variable
  const [paramsConfirmed, setParamsConfirmed] = useState(false)
  const [editingParams, setEditingParams] = useState({
    goal: '',
    target: '20% increase',
    timeline: 'Nov 15 - Dec 24, 2024',
    budget: '$250K'
  })
  const [strategyAccepted, setStrategyAccepted] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [expandedStrategyReasoning, setExpandedStrategyReasoning] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState('Tiered Exclusivity')
  const [sectionsVisited, setSectionsVisited] = useState<FlowState[]>(['welcome'])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const flowOrder: FlowState[] = ['welcome', 'goals', 'strategy', 'audience', 'channels', 'timeline', 'briefs', 'copy', 'review']
  const currentIndex = flowOrder.indexOf(flowState)
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < flowOrder.length - 1

  // Track section transitions and auto-scroll
  useEffect(() => {
    if (flowState !== 'welcome' && !sectionsVisited.includes(flowState)) {
      setSectionsVisited(prev => [...prev, flowState])
      
      // Auto-scroll to the new section after a brief delay
      setTimeout(() => {
        const sectionEl = sectionRefs.current[flowState]
        if (sectionEl && scrollAreaRef.current) {
          sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [flowState, sectionsVisited])

  const handlePrevious = () => {
    if (canGoPrevious) {
      onFlowStateChange(flowOrder[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      onFlowStateChange(flowOrder[currentIndex + 1])
    }
  }

  const examplePrompts = [
    { emoji: "🎁", text: "Holiday sale for VIP customers" },
    { emoji: "💫", text: "Win back lapsed subscribers" },
    { emoji: "🚀", text: "New product launch to high-value segments" }
  ]

  const handlePromptClick = (prompt: string | { emoji: string; text: string }) => {
    const text = typeof prompt === 'string' ? prompt : prompt.text
    handleSendMessage(text)
  }

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    // Move to goals state if on welcome
    if (flowState === 'welcome') {
      onFlowStateChange('goals')
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, userMessage])

    // Add thinking indicator with visible steps
    const thinkingMessageId = (Date.now() + 1).toString()
    const thinkingMessage: Message = {
      id: thinkingMessageId,
      type: 'ai',
      content: '',
      timestamp: 'Just now',
      thinking: true,
      thinkingAgent: 'Strategy Agent',
      thinkingSteps: ['Analyzing your goal', 'Reviewing past campaign data', 'Identifying optimal approach']
    }
    setMessages(prev => [...prev, thinkingMessage])

    // Simulate AI response after a delay
    setTimeout(() => {
      // Remove thinking and add actual message
      const aiMessage: Message = {
        id: thinkingMessageId,
        type: 'ai',
        content: "Great! I understand you want to " + messageText.toLowerCase() + ". Let me help you build a comprehensive campaign strategy.",
        timestamp: 'Just now',
        thinking: false
      }
      setMessages(prev => prev.map(msg => msg.id === thinkingMessageId ? aiMessage : msg))

      // Set campaign params after first message
      if (!campaignParams) {
        // Add thinking for next message
        const thinkingParamsId = (Date.now() + 2).toString()
        const thinkingParamsMessage: Message = {
          id: thinkingParamsId,
          type: 'ai',
          content: '',
          timestamp: 'Just now',
          thinking: true,
          thinkingAgent: 'Strategy Agent',
          thinkingSteps: ['Extracting campaign parameters', 'Setting recommended targets', 'Building timeline']
        }
        setTimeout(() => {
          setMessages(prev => [...prev, thinkingParamsMessage])
        }, 500)

        setTimeout(() => {
          const params = {
            goal: messageText,
            target: "20% increase",
            timeline: "Nov 15 - Dec 24, 2024",
            budget: "$250K"
          }
          setCampaignParams(params)
          setEditingParams(params)
          
          // Replace thinking with actual message about parameters
          const paramsMessage: Message = {
            id: thinkingParamsId,
            type: 'ai',
            content: "I've analyzed your historical data and drafted these parameters. Please review and adjust:",
            timestamp: 'Just now',
            confidence: 85,
            reasoning: `Why these recommendations:

• **20% increase target**: Your VIP segment grew 18% last holiday season. With improved email personalization and earlier campaign start, 20% is achievable but ambitious.

• **$250K budget**: Based on your 70K loyalty members and $3.50 avg CAC, this budget optimizes reach while maintaining 3.2x ROAS target.

• **Nov 15 - Dec 24 timeline**: Holiday purchase data shows your VIPs start shopping 10 days before Black Friday. Ending Dec 24 captures last-minute gifters.`,
            thinking: false
          }
          setMessages(prev => prev.map(msg => msg.id === thinkingParamsId ? paramsMessage : msg))
        }, 2000)
      }
    }, 1000)

    setInputValue('')
  }

  const toggleReasoning = (messageId: string) => {
    setExpandedReasoning(expandedReasoning === messageId ? null : messageId)
  }

  const handleConfirmParameters = () => {
    // Update campaign params with edited values
    setCampaignParams(editingParams)
    setParamsConfirmed(true)

    // Add confirmation AI message with thinking steps
    const confirmMessageId = Date.now().toString()
    const confirmMessage: Message = {
      id: confirmMessageId,
      type: 'ai',
      content: "Perfect, I've locked in these parameters. Let me analyze the best strategy...",
      timestamp: 'Just now',
      thinking: true,
      thinkingAgent: 'Strategy Agent',
      thinkingSteps: ['Locking in parameters', 'Analyzing historical data', 'Generating strategy options']
    }
    setMessages(prev => [...prev, confirmMessage])

    // Clear thinking indicator and advance to strategy
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === confirmMessageId ? { ...msg, thinking: false } : msg
      ))
      onFlowStateChange('strategy')
    }, 2000)
  }

  const handleAcceptStrategy = () => {
    setStrategyAccepted(true)
    
    // Add AI message about moving forward
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Excellent! "${selectedStrategy}" is locked in. Now let's define your target audience...`,
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, nextMessage])
    
    // Advance to audience after a brief delay
    setTimeout(() => {
      onFlowStateChange('audience')
    }, 1500)
  }

  const handleSelectAlternative = (strategyName: string) => {
    setSelectedStrategy(strategyName)
    setShowAlternatives(false)
    setStrategyAccepted(true)
    
    // Add AI message about the alternative selection
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Great choice! "${strategyName}" is locked in. Now let's define your target audience...`,
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, nextMessage])
    
    // Advance to audience after a brief delay
    setTimeout(() => {
      onFlowStateChange('audience')
    }, 1500)
  }

  const handleConfirmAudience = () => {
    // Add AI message about moving to channels
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "Perfect! Your audience segments are locked in. Now let's plan your channel mix and budget allocation...",
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, nextMessage])
    
    // Advance to channels after a brief delay
    setTimeout(() => {
      onFlowStateChange('channels')
    }, 1500)
  }

  const handleConfirmChannels = () => {
    // Add AI message about moving to timeline
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "Excellent! Your channel mix is locked in. Now let's map out the campaign timeline and scheduling...",
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, nextMessage])
    
    // Advance to timeline after a brief delay
    setTimeout(() => {
      onFlowStateChange('timeline')
    }, 1500)
  }

  const handleConfirmTimeline = () => {
    // Add AI message about moving to briefs
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "Great! Your timeline is approved. Now let me generate connected briefs for each channel...",
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, nextMessage])
    
    // Advance to briefs after a brief delay
    setTimeout(() => {
      onFlowStateChange('briefs')
    }, 1500)
  }

  const handleGenerateCopy = () => {
    // Add AI message about generating copy
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "Perfect! I'll now generate copy variations for your campaign. This will take a moment...",
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, nextMessage])
    
    // Advance to copy after a brief delay
    setTimeout(() => {
      onFlowStateChange('copy')
    }, 1500)
  }

  const handleConfirmCopy = (variationId: string) => {
    // Add AI message confirming copy selection
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Excellent choice! I've locked in ${variationId === 'refined' ? 'the refined version' : `Variation ${variationId.toUpperCase()}`}. Let me prepare your final campaign review...`,
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, nextMessage])
    
    // Advance to review after a brief delay
    setTimeout(() => {
      onFlowStateChange('review')
    }, 1500)
  }

  const handleLaunchCampaign = () => {
    const nextMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `✅ Campaign launched successfully!

What happens next:

• 📊 Performance Agent will monitor results starting Nov 15

• 💡 You'll get AI-powered optimization suggestions

• 🔔 Alerts if any channel underperforms`,
      timestamp: 'Just now',
      actionButtons: [
        { label: 'View Campaign Dashboard', variant: 'outline', action: 'dashboard' },
        { label: 'Start New Campaign', variant: 'default', action: 'new-campaign' }
      ]
    }
    setMessages(prev => [...prev, nextMessage])
  }

  const handleExportPlan = () => {
    // Placeholder for export functionality
    console.log('[v0] Exporting campaign plan...')
  }

  const handleShareLink = () => {
    // Placeholder for share functionality
    console.log('[v0] Sharing campaign link...')
  }

  const handleEditCampaign = () => {
    // Go back to goals
    onFlowStateChange('goals')
  }

  const handleSaveDraft = () => {
    // Placeholder for save draft functionality
    console.log('[v0] Saving campaign as draft...')
  }

  const handleViewDashboard = () => {
    // Placeholder for viewing dashboard
    console.log('[v0] Navigating to campaign dashboard...')
  }

  const handleStartNewCampaign = () => {
    // Reset to welcome state
    onFlowStateChange('welcome')
    setMessages([])
    setCampaignParams(null)
    setParamsConfirmed(false)
    setStrategyAccepted(false)
    setSectionsVisited(['welcome'])
  }

  const handleActionButton = (action?: string) => {
    switch (action) {
      case 'dashboard':
        handleViewDashboard()
        break
      case 'new-campaign':
        handleStartNewCampaign()
        break
      default:
        console.log('[v0] Unknown action:', action)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <ScrollArea className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6">
          {/* Welcome State */}
          {flowState === 'welcome' && sectionsVisited.includes('welcome') && (
            <div className="py-8 space-y-8">
              {/* Hero Message Card */}
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="bg-card rounded-xl p-5 border-l-4 border-accent shadow-sm">
                    <p className="text-lg font-medium text-foreground mb-2">
                      Hi Sarah 👋
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I'm your Campaign Co-Pilot. Tell me what you want to achieve, and I'll orchestrate the entire campaign — from strategy to creative.
                    </p>
                    <p className="text-sm text-foreground mt-4 font-medium">
                      What campaign are you planning?
                    </p>
                  </div>

                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto py-2.5 px-4 text-left hover:border-primary hover:bg-primary/5 hover:text-foreground transition-all bg-transparent rounded-full"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        <span className="mr-2">{prompt.emoji}</span>
                        <span className="text-sm text-foreground">{prompt.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GOALS SECTION */}
          {sectionsVisited.includes('goals') && (
            <div ref={(el) => { sectionRefs.current['goals'] = el }}>
              {sectionsVisited.length > 1 && <SectionDivider title="Goals" />}
              
              {/* Messages from goals phase */}
              {messages.filter(m => !m.content.includes("locked in") || m.content.includes("locked in these parameters")).map((message) => (
                <div key={message.id}>
                  {message.type === 'ai' ? (
                    <AIMessage
                      message={message}
                      expandedReasoning={expandedReasoning}
                      onToggleReasoning={toggleReasoning}
                      onQuickReply={handlePromptClick}
                      onActionButton={handleActionButton}
                    />
                  ) : (
                    <UserMessage message={message} />
                  )}
                </div>
              ))}

              {/* Campaign Parameters Card */}
              {campaignParams && !paramsConfirmed && (
                <Card className="p-4 border-l-4 border-l-primary bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-xs">📋</span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Campaign Parameters
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Goal */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Goal</label>
                      <Input
                        value={editingParams.goal}
                        onChange={(e) => setEditingParams({ ...editingParams, goal: e.target.value })}
                        placeholder="Enter your campaign goal"
                        className="text-sm"
                      />
                    </div>

                    {/* Target */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Target</label>
                      <Select
                        value={editingParams.target}
                        onValueChange={(value) => setEditingParams({ ...editingParams, target: value })}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10% increase">10% increase</SelectItem>
                          <SelectItem value="20% increase">20% increase</SelectItem>
                          <SelectItem value="30% increase">30% increase</SelectItem>
                          <SelectItem value="Custom...">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Timeline and Budget */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Timeline</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left text-sm font-normal bg-transparent">
                              <Calendar className="h-4 w-4 mr-2" />
                              {editingParams.timeline}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-3" align="start">
                            <div className="space-y-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start text-xs"
                                onClick={() => setEditingParams({ ...editingParams, timeline: 'Nov 15 - Dec 24, 2024' })}
                              >
                                Nov 15 - Dec 24, 2024
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start text-xs"
                                onClick={() => setEditingParams({ ...editingParams, timeline: 'Dec 1 - Dec 31, 2024' })}
                              >
                                Dec 1 - Dec 31, 2024
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-start text-xs"
                                onClick={() => setEditingParams({ ...editingParams, timeline: 'Q4 2024' })}
                              >
                                Q4 2024
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Budget</label>
                        <Select
                          value={editingParams.budget}
                          onValueChange={(value) => setEditingParams({ ...editingParams, budget: value })}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$100K">$100K</SelectItem>
                            <SelectItem value="$250K">$250K</SelectItem>
                            <SelectItem value="$500K">$500K</SelectItem>
                            <SelectItem value="$1M">$1M</SelectItem>
                            <SelectItem value="Custom...">Custom...</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Confirm Button */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                      onClick={handleConfirmParameters}
                      className="w-full gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Confirm Parameters
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* STRATEGY SECTION */}
          {sectionsVisited.includes('strategy') && (
            <div ref={(el) => { sectionRefs.current['strategy'] = el }} className="space-y-6">
              <SectionDivider title="Strategy" />
              <AgentHandoff agentName="Strategy Agent" />
              
              {/* Strategy Recommendation Card */}
              <Card className="border-l-4 border-l-accent bg-card">
                <div className="p-5">
                  <div className="mb-4">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Recommended Strategy
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                      {selectedStrategy}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {selectedStrategy === 'Tiered Exclusivity' 
                        ? 'Lead with early access and exclusive offers for loyalty members, using a tiered approach based on member value. Focus on gift-giving messaging over discount percentages.'
                        : selectedStrategy === 'Flash Sale Urgency'
                        ? 'Create time-limited offers with countdown timers to drive immediate action. Use scarcity messaging and limited inventory indicators.'
                        : 'Curate gift collections organized by recipient type (for her, for him, for kids, etc.). Simplify decision-making with expert-selected bundles.'}
                    </p>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground font-medium">Confidence</span>
                      <span className="text-foreground font-semibold">
                        {selectedStrategy === 'Tiered Exclusivity' 
                          ? '85%'
                          : selectedStrategy === 'Flash Sale Urgency'
                          ? '72%'
                          : '78%'}
                      </span>
                    </div>
                    <Progress 
                      value={selectedStrategy === 'Tiered Exclusivity' ? 85 : selectedStrategy === 'Flash Sale Urgency' ? 72 : 78} 
                      className="h-2"
                    />
                  </div>

                  {/* Expandable Reasoning */}
                  <div className="mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedStrategyReasoning(!expandedStrategyReasoning)}
                      className="w-full justify-between text-sm font-medium hover:bg-muted"
                    >
                      <span className="flex items-center gap-2">
                        {expandedStrategyReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        Why this strategy?
                      </span>
                    </Button>
                    
                    {expandedStrategyReasoning && (
                      <div className="mt-3 p-4 bg-muted/50 rounded-lg space-y-3">
                        <p className="text-sm font-medium text-foreground">Based on your data and goals:</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex gap-2">
                            <span className="text-foreground">•</span>
                            <span>Last year&apos;s &quot;exclusive early access&quot; campaign drove 34% higher conversion than general sale messaging</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-foreground">•</span>
                            <span>Your loyalty members respond 2.1x better to &quot;gift guides&quot; vs &quot;% off&quot; messaging</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-foreground">•</span>
                            <span>Tiered approach prevents over-discounting to high-value members who would purchase anyway</span>
                          </li>
                        </ul>
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                          Data sources: Holiday 2024 campaign performance, loyalty segment analysis, industry benchmarks
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!strategyAccepted && !showAlternatives && (
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAcceptStrategy}
                        className="flex-1"
                      >
                        Accept strategy
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowAlternatives(true)}
                        className="flex-1 bg-transparent"
                      >
                        Explore alternatives
                      </Button>
                    </div>
                  )}

                  {/* Strategy Accepted State */}
                  {strategyAccepted && (
                    <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg p-3">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">Strategy locked in</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Alternative Strategies */}
              {showAlternatives && !strategyAccepted && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Alternative Strategies</h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Alternative 1: Flash Sale Urgency */}
                    <Card className="border-2 hover:border-primary/50 transition-colors">
                      <div className="p-4 space-y-3">
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">Flash Sale Urgency</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Time-limited offers with countdown
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className="font-semibold">72%</span>
                          </div>
                          <Progress value={72} className="h-1.5" />
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                          <span className="text-amber-600">⚠️</span>
                          <span className="text-amber-900">May conflict with premium positioning</span>
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectAlternative('Flash Sale Urgency')}
                          className="w-full bg-transparent"
                        >
                          Select this instead
                        </Button>
                      </div>
                    </Card>

                    {/* Alternative 2: Gift Bundle Focus */}
                    <Card className="border-2 hover:border-primary/50 transition-colors">
                      <div className="p-4 space-y-3">
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">Gift Bundle Focus</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Curated gift collections by recipient type
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className="font-semibold">78%</span>
                          </div>
                          <Progress value={78} className="h-1.5" />
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                          <span className="text-blue-600">ℹ️</span>
                          <span className="text-blue-900">Good brand fit, less tested</span>
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectAlternative('Gift Bundle Focus')}
                          className="w-full bg-transparent"
                        >
                          Select this instead
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAlternatives(false)}
                    className="w-full"
                  >
                    Back to recommended strategy
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* AUDIENCE SECTION */}
          {sectionsVisited.includes('audience') && (
            <div ref={(el) => { sectionRefs.current['audience'] = el }}>
              <SectionDivider title="Audience" />
              <AgentHandoff agentName="Audience Agent" />
              <AudienceSegmentCards onConfirm={handleConfirmAudience} />
            </div>
          )}

          {/* CHANNELS SECTION */}
          {sectionsVisited.includes('channels') && (
            <div ref={(el) => { sectionRefs.current['channels'] = el }}>
              <SectionDivider title="Channels" />
              <AgentHandoff agentName="Channel Agent" />
              <ChannelPlanning onConfirm={handleConfirmChannels} />
            </div>
          )}

          {/* TIMELINE SECTION */}
          {sectionsVisited.includes('timeline') && (
            <div ref={(el) => { sectionRefs.current['timeline'] = el }}>
              <SectionDivider title="Timeline" />
              <CampaignTimeline onConfirm={handleConfirmTimeline} />
            </div>
          )}

          {/* BRIEFS SECTION */}
          {sectionsVisited.includes('briefs') && (
            <div ref={(el) => { sectionRefs.current['briefs'] = el }}>
              <SectionDivider title="Briefs" />
              <AgentHandoff agentName="Creative Agent" />
              <ConnectedBriefs onGenerateCopy={handleGenerateCopy} />
            </div>
          )}

          {/* COPY SECTION */}
          {sectionsVisited.includes('copy') && (
            <div ref={(el) => { sectionRefs.current['copy'] = el }}>
              <SectionDivider title="Creative" />
              <CopyGeneration onConfirm={handleConfirmCopy} />
            </div>
          )}

          {/* REVIEW SECTION */}
          {sectionsVisited.includes('review') && (
            <div ref={(el) => { sectionRefs.current['review'] = el }}>
              <SectionDivider title="Review & Launch" />
              <CampaignReview 
                onLaunch={handleLaunchCampaign}
                onExport={handleExportPlan}
                onShare={handleShareLink}
                onEdit={handleEditCampaign}
                onSaveDraft={handleSaveDraft}
              />
              
              {/* Show launch success messages */}
              {messages.filter(m => m.content.includes('Campaign launched successfully')).map((message) => (
                <div key={message.id}>
                  <AIMessage
                    message={message}
                    expandedReasoning={expandedReasoning}
                    onToggleReasoning={toggleReasoning}
                    onQuickReply={handlePromptClick}
                    onActionButton={handleActionButton}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </ScrollArea>

      {/* Navigation & Input Area */}
      <div className="border-t border-border bg-card">
        {/* Navigation Buttons */}
        <div className="px-4 md:px-6 pt-4 border-b border-border">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {flowState === 'welcome' ? 'Welcome' : flowState.charAt(0).toUpperCase() + flowState.slice(1)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!canGoNext}
              className="gap-2 bg-transparent"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-background"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button 
                size="icon" 
                className="flex-shrink-0"
                onClick={() => handleSendMessage()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIMessage({
  message,
  expandedReasoning,
  onToggleReasoning,
  onQuickReply,
  onActionButton
}: {
  message: Message
  expandedReasoning: string | null
  onToggleReasoning: (id: string) => void
  onQuickReply: (reply: string) => void
  onActionButton?: (action?: string) => void
}) {
  const isReasoningExpanded = expandedReasoning === message.id

  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="flex-1 space-y-3">
        {/* Enhanced Thinking Indicator */}
        {message.thinking && (
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce"></span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {message.thinkingAgent || 'Strategy Agent'} is thinking...
              </span>
            </div>
            {message.thinkingSteps && message.thinkingSteps.length > 0 && (
              <div className="space-y-2 pl-1">
                {message.thinkingSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 400}ms`, animationFillMode: 'backwards' }}
                  >
                    <Check className="h-3 w-3 text-primary" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="bg-card rounded-xl p-4 border-l-4 border-accent shadow-sm">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
            {message.content}
          </p>

          {/* Confidence Indicator */}
          {message.confidence && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium text-foreground">{message.confidence}%</span>
              </div>
              <Progress value={message.confidence} className="h-1.5" />
            </div>
          )}

          {/* Action Buttons */}
          {message.actionButtons && (
            <div className="mt-4 flex flex-wrap gap-2">
              {message.actionButtons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || 'default'}
                  size="sm"
                  onClick={() => onActionButton?.(button.action)}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Reasoning Block */}
        {message.reasoning && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onToggleReasoning(message.id)}
            >
              {isReasoningExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide reasoning
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Why?
                </>
              )}
            </Button>
            {isReasoningExpanded && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                  {message.reasoning?.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-foreground font-semibold">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Reply Chips */}
        {message.quickReplies && (
          <div className="flex flex-wrap gap-2">
            {message.quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 text-xs rounded-full bg-transparent"
                onClick={() => onQuickReply(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
        )}
      </div>
    </div>
  )
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end">
      <div className="max-w-xl space-y-2">
        <div className="bg-primary rounded-xl p-4 shadow-sm">
          <p className="text-sm leading-relaxed text-primary-foreground">
            {message.content}
          </p>
        </div>
        {message.timestamp && (
          <p className="text-xs text-muted-foreground text-right">
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  )
}
