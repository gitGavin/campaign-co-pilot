'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { 
  Radio, 
  Mail, 
  MessageSquare, 
  Bell, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BarChart3
} from 'lucide-react'

interface Channel {
  id: string
  name: string
  icon: React.ReactNode
  percentage: number
  amount: number
  metrics: string
  color: string
}

interface AIFeedback {
  impacts: {
    type: 'positive' | 'warning'
    message: string
  }[]
  suggestion: string
}

interface ChannelPlanningProps {
  onConfirm?: () => void
}

export function ChannelPlanning({ onConfirm }: ChannelPlanningProps = {}) {
  const totalBudget = 500000
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="h-4 w-4" />,
      percentage: 45,
      amount: 225000,
      metrics: '28% open, 4.2% CTR',
      color: 'bg-blue-500'
    },
    {
      id: 'paid-social',
      name: 'Paid Social',
      icon: <Radio className="h-4 w-4" />,
      percentage: 30,
      amount: 150000,
      metrics: '2.8M impressions, 3.2 ROAS',
      color: 'bg-purple-500'
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: <MessageSquare className="h-4 w-4" />,
      percentage: 20,
      amount: 100000,
      metrics: '42% open, 8.1% CTR',
      color: 'bg-green-500'
    },
    {
      id: 'push',
      name: 'Push',
      icon: <Bell className="h-4 w-4" />,
      percentage: 5,
      amount: 25000,
      metrics: 'Supporting role',
      color: 'bg-amber-500'
    }
  ])

  const [originalChannels] = useState<Channel[]>(channels)
  const [showFeedback, setShowFeedback] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
  const [expandedReasoning, setExpandedReasoning] = useState(false)
  const confidence = 82

  const hasChanges = channels.some((channel, index) => 
    channel.percentage !== originalChannels[index].percentage
  )

  const handlePercentageChange = (channelId: string, newPercentage: number) => {
    // Get other channels and calculate how much we need to redistribute
    const otherChannels = channels.filter(ch => ch.id !== channelId)
    const otherTotal = otherChannels.reduce((sum, ch) => sum + ch.percentage, 0)
    const remainingForOthers = 100 - newPercentage

    // Calculate scale factor to redistribute remaining percentage proportionally
    const scaleFactor = otherTotal > 0 ? remainingForOthers / otherTotal : 0

    // Build updated channels ensuring exact 100% total
    let runningTotal = newPercentage
    const updatedChannels = channels.map((ch, index) => {
      if (ch.id === channelId) {
        return {
          ...ch,
          percentage: newPercentage,
          amount: Math.round((newPercentage / 100) * totalBudget)
        }
      }

      // For the last other channel, assign whatever's left to avoid rounding errors
      const isLastOther = index === channels.length - 1 ||
        channels.slice(index + 1).every(c => c.id === channelId)

      let newPct: number
      if (isLastOther) {
        newPct = 100 - runningTotal
      } else {
        newPct = Math.round(ch.percentage * scaleFactor)
      }

      newPct = Math.max(0, Math.min(100, newPct))
      runningTotal += newPct

      return {
        ...ch,
        percentage: newPct,
        amount: Math.round((newPct / 100) * totalBudget)
      }
    })

    // Final safety check - ensure exactly 100%
    const total = updatedChannels.reduce((sum, ch) => sum + ch.percentage, 0)
    if (total !== 100) {
      // Adjust the last non-changed channel
      const lastOther = updatedChannels.filter(ch => ch.id !== channelId).pop()
      if (lastOther) {
        const idx = updatedChannels.findIndex(ch => ch.id === lastOther.id)
        updatedChannels[idx] = {
          ...updatedChannels[idx],
          percentage: updatedChannels[idx].percentage + (100 - total),
          amount: Math.round(((updatedChannels[idx].percentage + (100 - total)) / 100) * totalBudget)
        }
      }
    }

    setChannels(updatedChannels)
    generateFeedback(updatedChannels, originalChannels)
    setShowFeedback(true)
  }

  const generateFeedback = (current: Channel[], original: Channel[]) => {
    const emailChange = current.find(c => c.id === 'email')!.percentage - original.find(c => c.id === 'email')!.percentage
    const socialChange = current.find(c => c.id === 'paid-social')!.percentage - original.find(c => c.id === 'paid-social')!.percentage

    const impacts: AIFeedback['impacts'] = []

    if (emailChange > 5) {
      impacts.push({
        type: 'positive',
        message: `Email revenue prediction increases by ~$${Math.round(emailChange * 4000).toLocaleString()}`
      })
    }

    if (socialChange < -5) {
      impacts.push({
        type: 'warning',
        message: `Paid reach drops by ~${Math.abs(Math.round(socialChange * 93000)).toLocaleString()} impressions`
      })
      impacts.push({
        type: 'warning',
        message: 'Lapsed Loyalists may be harder to reach'
      })
    }

    if (emailChange < -10) {
      impacts.push({
        type: 'warning',
        message: 'Email engagement opportunities decreased significantly'
      })
    }

    setAiFeedback({
      impacts,
      suggestion: socialChange < -5 
        ? "Keep Paid Social at 25% minimum to maintain reach across all segments"
        : "Your changes align well with the campaign goals"
    })
  }

  const handleApplySuggestion = () => {
    setChannels([...originalChannels])
    setShowFeedback(false)
    setAiFeedback(null)
  }

  const handleReset = () => {
    setChannels([...originalChannels])
    setShowFeedback(false)
    setAiFeedback(null)
  }

  const totalPercentage = channels.reduce((sum, ch) => sum + ch.percentage, 0)

  return (
    <div className="space-y-6">
      {/* Agent Header */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
          <Radio className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Channel Agent</h3>
          <p className="text-sm text-muted-foreground">
            Based on your audience and strategy, here's my recommended channel mix:
          </p>
        </div>
      </div>

      {/* Channel Mix Card */}
      <Card className="p-6 border-2 border-accent/20">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-serif text-lg font-semibold text-foreground">
            Recommended Channel Mix
          </h4>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="text-xl font-bold text-foreground">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-6">
          {channels.map((channel) => (
            <div key={channel.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded ${channel.color} flex items-center justify-center text-white`}>
                    {channel.icon}
                  </div>
                  <span className="font-medium text-foreground">{channel.name}</span>
                </div>
                <span className="font-bold text-foreground text-lg">
                  {channel.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <Progress 
                  value={channel.percentage} 
                  className="h-3"
                  indicatorClassName={channel.color}
                />
              </div>

              {/* Slider */}
              <Slider
                value={[channel.percentage]}
                onValueChange={([value]) => handlePercentageChange(channel.id, value)}
                max={100}
                step={1}
                className="cursor-pointer"
              />

              {/* Metrics */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  ${channel.amount.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  {channel.metrics}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Confidence Indicator */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-primary hover:text-primary"
                onClick={() => setExpandedReasoning(!expandedReasoning)}
              >
                {expandedReasoning ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Why?
                  </>
                )}
              </Button>
            </div>
            <span className="font-semibold text-foreground">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />

          {/* Reasoning Panel */}
          {expandedReasoning && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border space-y-3">
              <div>
                <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Data Sources
                </h5>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Historical campaign performance (18 months)</li>
                  <li>Industry benchmarks for SaaS B2B</li>
                  <li>Audience channel preferences analysis</li>
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground mb-2">Key Factors</h5>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Email shows highest conversion rate for your segments</li>
                  <li>Paid Social optimal for reaching "Digital Adopters"</li>
                  <li>SMS effective for time-sensitive offers</li>
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground mb-2">Assumptions</h5>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Budget allocated evenly across 90-day timeline</li>
                  <li>Creative assets ready for all channels</li>
                  <li>Email list includes 85% deliverable contacts</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Total Check */}
        {totalPercentage !== 100 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <span className="text-sm text-amber-900 dark:text-amber-200">
              Total: {totalPercentage}% (adjust to 100%)
            </span>
          </div>
        )}
      </Card>

      {/* AI Feedback Component */}
      {showFeedback && aiFeedback && hasChanges && (
        <Card className="p-5 bg-accent/5 border-2 border-accent/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-3">
                Impact of your changes:
              </h4>
              <div className="space-y-2">
                {aiFeedback.impacts.map((impact, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {impact.type === 'positive' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm text-foreground">{impact.message}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-medium text-foreground">Suggestion:</span>{' '}
                  {aiFeedback.suggestion}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleApplySuggestion}
                  >
                    Apply suggestion
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedback(false)}
                    className="bg-transparent"
                  >
                    Keep my changes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" disabled={totalPercentage !== 100} onClick={onConfirm}>
          Accept mix
        </Button>
        <Button variant="outline" size="lg" className="bg-transparent">
          Add/remove channels
        </Button>
        <Button variant="outline" size="lg" className="bg-transparent">
          View timeline
        </Button>
      </div>
    </div>
  )
}
