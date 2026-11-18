'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Edit3,
  RefreshCw,
  Wand2,
  Star,
  Loader2,
  AlertCircle,
  Zap
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface CopyVariation {
  id: string
  label: string
  tag?: string | null
  subject: string
  preview: string
  body: string
  isRecommended?: boolean
  reasoning?: string
}

interface RefinedCopy {
  subject: string
  preview: string
  body: string
}

interface CopyGenerationProps {
  onConfirm?: (variationId: string) => void
}

// Default brief context - in a real app, this would come from props or context
const defaultBriefContext = {
  campaignName: "Holiday Loyalty Campaign",
  goal: "Drive 20% more holiday sales from loyalty members",
  strategy: "Tiered Exclusivity",
  audience: "VIP Loyalists + Lapsed Loyalists (70K members)",
  audienceInsights: [
    "3.2x higher email open rate than average",
    "Respond to 'exclusive' and 'early access' framing",
    "72% have purchased gifts in past holidays",
    "VIPs prefer premium language"
  ],
  messagingDirection: {
    theme: "Your exclusive holiday preview",
    dos: [
      "Lead with exclusivity ('Members-only early access')",
      "Emphasize value over discount",
      "Use gift-giving angle ('Perfect gifts, chosen for you')",
      "Personalize based on past purchase categories"
    ],
    donts: [
      "Use 'doorbuster' or discount-heavy language",
      "Generic holiday imagery",
      "Pressure tactics that feel desperate"
    ]
  },
  channel: "Email - Primary conversion driver (45%)",
  emailNumber: 1,
  emailPurpose: "Teaser - 'Early access is coming' anticipation builder"
}

// Fallback variations in case API fails
const fallbackVariations: CopyVariation[] = [
  {
    id: 'a',
    label: 'VARIATION A',
    subject: "Your early access starts soon, {{name}}",
    preview: "The holiday collection you've been waiting for",
    body: `{{name}},

As one of our most valued members, you deserve first look at something special.

This Friday, you'll get exclusive early access to our holiday collection — 48 hours before anyone else.

No crowds. No waiting. Just the perfect gifts, chosen for the people who matter most.

Keep an eye on your inbox.

[Get ready →]`,
    isRecommended: true,
    reasoning: "Balanced approach emphasizing exclusivity and value"
  },
  {
    id: 'b',
    label: 'VARIATION B',
    tag: 'More urgency',
    subject: "{{name}}, mark your calendar: Nov 17",
    preview: "Your exclusive window opens in 3 days",
    body: `{{name}},

Your VIP early access window opens in exactly 3 days.

November 17, 9 AM EST — that's when you get first pick of our holiday collection.

Set a reminder. Share your list. This is your moment.

48 hours of exclusive access before the public launch.

[Mark your calendar →]`,
    isRecommended: false,
    reasoning: "Urgency-focused with specific timing"
  },
  {
    id: 'c',
    label: 'VARIATION C',
    tag: 'Gift-focused',
    subject: "The gift guide they'll actually love",
    preview: "Curated picks, early access, just for you",
    body: `{{name}},

Finding the perfect gift shouldn't be stressful.

We've curated our best holiday pieces just for our VIP members — and you're getting first access.

Browse thoughtfully selected gifts that actually delight. No guesswork, no last-minute panic.

Your early access starts Friday, November 17.

[View the collection →]`,
    isRecommended: false,
    reasoning: "Emotional gift-giving angle"
  }
]

export function CopyGeneration({ onConfirm }: CopyGenerationProps = {}) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [isRefining, setIsRefining] = useState(false)
  const [expandedVariation, setExpandedVariation] = useState<string>('a')
  const [refinementInput, setRefinementInput] = useState('')
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null)
  const [variations, setVariations] = useState<CopyVariation[]>([])
  const [refinedCopy, setRefinedCopy] = useState<RefinedCopy | null>(null)
  const [refinementChanges, setRefinementChanges] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [useRealApi, setUseRealApi] = useState(true)
  const [visibleVariations, setVisibleVariations] = useState<number>(0)
  const [generatingStep, setGeneratingStep] = useState(0)

  // Generate copy on mount
  useEffect(() => {
    generateCopy()
  }, [])

  // Cycle through generating steps for loading animation
  useEffect(() => {
    if (isGenerating) {
      setGeneratingStep(0)
      const interval = setInterval(() => {
        setGeneratingStep(prev => (prev + 1) % 4)
      }, 800)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  // Staggered reveal of variations
  useEffect(() => {
    if (!isGenerating && variations.length > 0 && visibleVariations < variations.length) {
      const timer = setTimeout(() => {
        setVisibleVariations(prev => prev + 1)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isGenerating, variations.length, visibleVariations])

  // Reset visible variations when regenerating
  useEffect(() => {
    if (isGenerating) {
      setVisibleVariations(0)
    }
  }, [isGenerating])

  const generateCopy = async () => {
    setIsGenerating(true)
    setError(null)
    setVariations([])

    if (!useRealApi) {
      // Use fallback variations
      setTimeout(() => {
        setVariations(fallbackVariations)
        setIsGenerating(false)
      }, 1500)
      return
    }

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          briefContext: defaultBriefContext
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()

      if (data.variations && data.variations.length > 0) {
        setVariations(data.variations)
      } else {
        throw new Error('No variations returned')
      }
    } catch (err) {
      console.error('Generation error:', err)
      // Fall back to static variations
      setVariations(fallbackVariations)
      setError('Using demo copy (API unavailable). Add ANTHROPIC_API_KEY to .env.local for live generation.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefine = async () => {
    if (!refinementInput.trim()) return

    const currentVariation = variations.find(v => v.id === expandedVariation) || variations[0]
    if (!currentVariation) return

    setIsRefining(true)
    setError(null)

    if (!useRealApi) {
      // Simulate refinement
      setTimeout(() => {
        setRefinedCopy({
          subject: "{{name}}, early access Friday 9AM",
          preview: "48 hours before anyone else",
          body: `{{name}},

Friday at 9 AM — your VIP early access begins.

48 hours of exclusive access to our holiday collection before the public launch.

No crowds. Just the perfect gifts.

[Set reminder →]`
        })
        setRefinementChanges([
          "Cut word count by 40%",
          "Added specific time for urgency",
          "Shortened CTA"
        ])
        setIsRefining(false)
      }, 2000)
      return
    }

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refine',
          refinementRequest: {
            originalCopy: {
              subject: currentVariation.subject,
              preview: currentVariation.preview,
              body: currentVariation.body
            },
            refinementPrompt: refinementInput,
            briefContext: defaultBriefContext
          }
        })
      })

      if (!response.ok) {
        throw new Error('Refinement request failed')
      }

      const data = await response.json()

      if (data.refined) {
        setRefinedCopy(data.refined)
        setRefinementChanges(data.changes || [])
      }
    } catch (err) {
      console.error('Refinement error:', err)
      // Fall back to simulated refinement
      setRefinedCopy({
        subject: "{{name}}, early access Friday 9AM",
        preview: "48 hours before anyone else",
        body: `{{name}},

Friday at 9 AM — your VIP early access begins.

48 hours of exclusive access to our holiday collection before the public launch.

No crowds. Just the perfect gifts.

[Set reminder →]`
      })
      setRefinementChanges([
        "Applied your refinement request",
        "Adjusted tone and length",
        "Optimized for clarity"
      ])
      setError('Using demo refinement (API unavailable)')
    } finally {
      setIsRefining(false)
    }
  }

  const handleQuickRefine = (chip: string) => {
    setRefinementInput(chip)
    // Trigger refine after state update
    setTimeout(() => handleRefine(), 0)
  }

  const toggleVariation = (id: string) => {
    setExpandedVariation(expandedVariation === id ? '' : id)
  }

  const handleUseVariation = (id: string) => {
    setSelectedVariation(id)
    if (onConfirm) {
      onConfirm(id)
    }
  }

  const refinementChips = [
    'Shorter',
    'More urgent',
    'More personal',
    'Formal',
    'Add emoji',
    'Remove jargon'
  ]

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Agent Header */}
      <div className="px-4 md:px-6 py-4 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Edit3 className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Creative Agent
                </h2>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 gap-1">
                  <Zap className="h-3 w-3" />
                  Powered by Claude
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Generating copy for Email 1: Teaser (Nov 15)
              </p>
            </div>
          </div>

          <Card className="p-3 bg-muted/50 border-accent/20">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Based on:</span> Email brief, VIP Loyalists audience, brand voice
            </p>
          </Card>

          {/* API Toggle for Demo */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={useRealApi ? "default" : "outline"}
              onClick={() => setUseRealApi(true)}
              className="text-xs"
            >
              Live API
            </Button>
            <Button
              size="sm"
              variant={!useRealApi ? "default" : "outline"}
              onClick={() => setUseRealApi(false)}
              className="text-xs"
            >
              Demo Mode
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Error Notice */}
          {error && (
            <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">{error}</p>
              </div>
            </Card>
          )}

          {/* Enhanced Loading State */}
          {isGenerating && (
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Creative Agent is crafting your copy...
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {useRealApi ? 'Powered by Claude AI' : 'Loading demo variations'}
                    </p>
                  </div>
                </div>

                {/* Generating Steps */}
                <div className="space-y-2 pl-1">
                  {[
                    'Analyzing audience insights',
                    'Applying brand voice guidelines',
                    'Generating creative angles',
                    'Crafting 3 unique variations'
                  ].map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                        index <= generatingStep ? 'text-foreground' : 'text-muted-foreground/50'
                      }`}
                    >
                      {index < generatingStep ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : index === generatingStep ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Copy Variations with Staggered Reveal */}
          {!isGenerating && variations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-foreground animate-in fade-in duration-300">
                Generated Variations
              </h3>

              {variations.map((variation, index) => {
                const isExpanded = expandedVariation === variation.id
                const isSelected = selectedVariation === variation.id
                const isVisible = index < visibleVariations

                if (!isVisible) return null

                return (
                  <Card
                    key={variation.id}
                    className={`overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                      isSelected
                        ? 'border-primary shadow-md shadow-primary/10'
                        : variation.isRecommended
                        ? 'border-accent/30 shadow-lg shadow-accent/5'
                        : ''
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Header */}
                    <div className="p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-mono text-sm font-semibold text-foreground">
                            {variation.label}
                          </h4>
                          {variation.isRecommended && (
                            <Badge className="bg-gradient-to-r from-accent/20 to-primary/20 text-accent border-accent/30 gap-1 shadow-sm shadow-accent/20 animate-pulse">
                              <Star className="h-3 w-3 fill-current" />
                              Recommended
                            </Badge>
                          )}
                          {variation.tag && !variation.isRecommended && (
                            <Badge variant="secondary" className="text-xs">
                              {variation.tag}
                            </Badge>
                          )}
                          {isSelected && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                              <Check className="h-3 w-3" />
                              Selected
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!isExpanded && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUseVariation(variation.id)}
                              className="bg-transparent"
                            >
                              Use this
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleVariation(variation.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Subject:
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {variation.subject}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Preview:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {variation.preview}
                        </p>
                      </div>

                      {/* Expanded Body */}
                      {isExpanded && (
                        <>
                          <Separator className="my-3" />

                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Body:
                            </p>
                            <div className="bg-muted/50 rounded-lg p-4 border border-border">
                              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                                {variation.body}
                              </pre>
                            </div>
                          </div>

                          {/* Reasoning */}
                          {variation.reasoning && (
                            <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">AI reasoning:</span> {variation.reasoning}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleUseVariation(variation.id)}
                              className="gap-2"
                            >
                              <Check className="h-4 w-4" />
                              Use this
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 bg-transparent"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 bg-transparent"
                              onClick={() => setExpandedVariation(variation.id)}
                            >
                              <Wand2 className="h-4 w-4" />
                              Refine
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Refinement Input */}
          {!isGenerating && variations.length > 0 && (
            <Card className="p-4 space-y-4 border-primary/20">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Refine this copy:
                </label>
                <Textarea
                  placeholder="Make it shorter and add more urgency..."
                  value={refinementInput}
                  onChange={(e) => setRefinementInput(e.target.value)}
                  className="min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleRefine()
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Quick refinements:
                </p>
                <div className="flex flex-wrap gap-2">
                  {refinementChips.map((chip) => (
                    <Button
                      key={chip}
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickRefine(chip)}
                      disabled={isRefining}
                      className="bg-transparent"
                    >
                      {chip}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleRefine}
                disabled={!refinementInput.trim() || isRefining}
                className="w-full gap-2"
              >
                {isRefining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Refine copy
                  </>
                )}
              </Button>
            </Card>
          )}

          {/* Refinement Response */}
          {refinedCopy && !isRefining && (
            <Card className="p-4 space-y-4 bg-accent/5 border-accent/20">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Updated copy:
                    </h4>
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Subject:
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {refinedCopy.subject}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Preview:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {refinedCopy.preview}
                          </p>
                        </div>
                        <Separator />
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                          {refinedCopy.body}
                        </pre>
                      </div>
                    </div>
                  </div>
                  {refinementChanges.length > 0 && (
                    <Card className="p-3 bg-muted/50 border-none">
                      <p className="text-xs font-medium text-foreground mb-2">
                        Changes made:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {refinementChanges.map((change, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="gap-2" onClick={() => handleUseVariation('refined')}>
                      <Check className="h-4 w-4" />
                      Use this copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => {
                        setRefinedCopy(null)
                        setRefinementChanges([])
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit further
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          {!isGenerating && variations.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="gap-2 bg-transparent flex-1"
                onClick={generateCopy}
              >
                <RefreshCw className="h-4 w-4" />
                Try another direction
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-transparent flex-1"
                onClick={generateCopy}
              >
                <Sparkles className="h-4 w-4" />
                Generate more variations
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
