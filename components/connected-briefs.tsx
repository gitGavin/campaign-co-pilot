'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Download,
  Users as UsersIcon,
  Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SyncStatus = 'synced' | 'edited' | 'updating'

interface Brief {
  id: string
  channel: string
  title: string
  syncStatus: SyncStatus
  campaignContext: {
    goal: string
    strategy: string
    channelRole: string
  }
  targetAudience: {
    segments: string[]
    insights: string[]
  }
  messaging: {
    theme: string
    dos: string[]
    donts: string[]
  }
  timeline: {
    deliverable: string
    date: string
  }[]
}

interface ConnectedBriefsProps {
  onGenerateCopy?: () => void
}

export function ConnectedBriefs({ onGenerateCopy }: ConnectedBriefsProps = {}) {
  const [expandedBrief, setExpandedBrief] = useState<string | null>(null)

  const briefs: Brief[] = [
    {
      id: 'email',
      channel: 'Email',
      title: 'Holiday Loyalty Campaign',
      syncStatus: 'synced',
      campaignContext: {
        goal: 'Drive 20% incremental holiday sales',
        strategy: 'Tiered Exclusivity',
        channelRole: 'Primary conversion driver (45%)',
      },
      targetAudience: {
        segments: ['VIP Loyalists (42K)', 'Lapsed Loyalists (28K)'],
        insights: [
          '3.2x higher open rate than average',
          'Respond to "exclusive" and "early access"',
          '72% have purchased gifts in past holidays',
        ],
      },
      messaging: {
        theme: 'Your exclusive holiday preview',
        dos: [
          'Lead with exclusivity',
          'Emphasize value over discount',
          'Use gift-giving angle',
        ],
        donts: [
          'Use "doorbuster" language',
          'Generic holiday imagery',
        ],
      },
      timeline: [
        { deliverable: 'Email 1: Teaser', date: 'Nov 15' },
        { deliverable: 'Email 2: Main Offer', date: 'Nov 22' },
        { deliverable: 'Email 3: Reminder', date: 'Dec 6' },
        { deliverable: 'Email 4: Last Chance', date: 'Dec 15' },
      ],
    },
    {
      id: 'sms',
      channel: 'SMS',
      title: 'Holiday Loyalty Campaign',
      syncStatus: 'synced',
      campaignContext: {
        goal: 'Drive 20% incremental holiday sales',
        strategy: 'Tiered Exclusivity',
        channelRole: 'Time-sensitive urgency driver (25%)',
      },
      targetAudience: {
        segments: ['VIP Loyalists (42K)', 'High-Intent Browsers (18K)'],
        insights: [
          '2.8x click-through rate for limited offers',
          'Prefer concise, direct messaging',
          'Peak response within 3 hours of send',
        ],
      },
      messaging: {
        theme: 'Flash access for VIPs',
        dos: [
          'Keep it under 160 characters',
          'Include clear CTA link',
          'Add urgency with time limits',
        ],
        donts: [
          'Send more than 2x per week',
          'Use excessive emojis',
        ],
      },
      timeline: [
        { deliverable: 'SMS 1: Early Access Alert', date: 'Nov 15' },
        { deliverable: 'SMS 2: 24hr Reminder', date: 'Nov 21' },
        { deliverable: 'SMS 3: Final Hours', date: 'Dec 15' },
      ],
    },
    {
      id: 'social',
      channel: 'Paid Social',
      title: 'Holiday Loyalty Campaign',
      syncStatus: 'edited',
      campaignContext: {
        goal: 'Drive 20% incremental holiday sales',
        strategy: 'Tiered Exclusivity',
        channelRole: 'Awareness & social proof driver (30%)',
      },
      targetAudience: {
        segments: ['VIP Loyalists (42K)', 'Gift Givers (35K)'],
        insights: [
          'High engagement with UGC content',
          'Respond to aspirational lifestyle imagery',
          'Peak engagement evenings & weekends',
        ],
      },
      messaging: {
        theme: 'Join the exclusive club',
        dos: [
          'Use customer photos and testimonials',
          'Showcase product in lifestyle context',
          'Highlight community aspect',
        ],
        donts: [
          'Stock photography',
          'Overly promotional tone',
        ],
      },
      timeline: [
        { deliverable: 'Teaser Campaign', date: 'Nov 10-14' },
        { deliverable: 'Launch Campaign', date: 'Nov 15-25' },
        { deliverable: 'Retargeting Campaign', date: 'Dec 1-15' },
      ],
    },
  ]

  const getSyncStatusConfig = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return {
          icon: CheckCircle2,
          label: 'Synced',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        }
      case 'edited':
        return {
          icon: AlertCircle,
          label: 'Edited',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        }
      case 'updating':
        return {
          icon: Loader2,
          label: 'Updating',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        }
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Connected Briefs
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Generated from your campaign strategy. Briefs stay synced with your master plan.
        </p>
      </div>

      {/* Nested Strategy & Briefs Container */}
      <Card className="overflow-hidden border-2 border-primary/20">
        {/* Master Strategy Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Master Strategy</h3>
                <p className="text-xs text-white/80">Holiday Loyalty - Tiered Exclusivity</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              3 Briefs Connected
            </Badge>
          </div>
        </div>

        {/* Derived Briefs Section */}
        <div className="p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Channel Briefs
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Brief Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {briefs.map((brief) => {
          const statusConfig = getSyncStatusConfig(brief.syncStatus)
          const isExpanded = expandedBrief === brief.id

          return (
            <Card 
              key={brief.id}
              className={cn(
                "transition-all duration-200",
                isExpanded && "md:col-span-3 shadow-lg"
              )}
            >
              {!isExpanded ? (
                // Collapsed Card View - Compact
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {brief.channel}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {brief.campaignContext.channelRole}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 text-xs",
                        statusConfig.bgColor,
                        statusConfig.borderColor
                      )}
                    >
                      <statusConfig.icon
                        className={cn(
                          "h-3 w-3",
                          statusConfig.color,
                          brief.syncStatus === 'updating' && "animate-spin"
                        )}
                      />
                      <span className={statusConfig.color}>{statusConfig.label}</span>
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {brief.timeline.length} deliverables
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => setExpandedBrief(brief.id)}
                  >
                    View Brief
                  </Button>
                </div>
              ) : (
                // Expanded Brief View
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {brief.channel} Brief
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {brief.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "gap-1.5",
                          statusConfig.bgColor,
                          statusConfig.borderColor
                        )}
                      >
                        <statusConfig.icon 
                          className={cn(
                            "h-3 w-3",
                            statusConfig.color,
                            brief.syncStatus === 'updating' && "animate-spin"
                          )} 
                        />
                        <span className={statusConfig.color}>{statusConfig.label}</span>
                      </Badge>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setExpandedBrief(null)}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Campaign Context */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Campaign Context
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Goal: </span>
                        <span className="text-muted-foreground">{brief.campaignContext.goal}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Strategy: </span>
                        <span className="text-muted-foreground">{brief.campaignContext.strategy}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">This channel's role: </span>
                        <span className="text-muted-foreground">{brief.campaignContext.channelRole}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Target Audience */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Target Audience
                    </h4>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {brief.targetAudience.segments.map((segment, idx) => (
                          <Badge key={idx} variant="secondary" className="gap-1.5">
                            <UsersIcon className="h-3 w-3" />
                            {segment}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Key insights for {brief.channel.toLowerCase()}:
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {brief.targetAudience.insights.map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Messaging Direction */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Messaging Direction
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Theme: </span>
                          <span className="text-muted-foreground">"{brief.messaging.theme}"</span>
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* DO Section */}
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            DO:
                          </p>
                          <ul className="space-y-1.5">
                            {brief.messaging.dos.map((item, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* DON'T Section */}
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4" />
                            DON'T:
                          </p>
                          <ul className="space-y-1.5">
                            {brief.messaging.donts.map((item, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Timeline & Deliverables */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Timeline & Deliverables
                    </h4>
                    <div className="space-y-2">
                      {brief.timeline.map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                        >
                          <span className="text-sm text-foreground">{item.deliverable}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.date}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button className="gap-2" onClick={onGenerateCopy}>
                      <Copy className="h-4 w-4" />
                      Generate copy drafts
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <UsersIcon className="h-4 w-4" />
                      Assign to team
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
          </div>
        </div>
      </Card>
    </div>
  )
}
