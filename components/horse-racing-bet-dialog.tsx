"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Gift, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { loadBonusBets, saveBonusBets, loadPromoUsage, savePromoUsage } from "@/lib/storage"

export function HorseRacingBetDialog({ open, onOpenChange, onSaveBet, editMode = false, initialBet = null }) {
  const { toast } = useToast()
  const [betType, setBetType] = useState("single")
  const [date, setDate] = useState(new Date())
  const [isPromo, setIsPromo] = useState(false)
  const [promoType, setPromoType] = useState("")
  const [bonusTriggered, setBonusTriggered] = useState(false)
  const [isStakeNotReturned, setIsStakeNotReturned] = useState(false)
  const [bookieForBonus, setBookieForBonus] = useState(null)
  const [selectedBonusBetAmount, setSelectedBonusBetAmount] = useState(0)
  const [usingBonusBet, setUsingBonusBet] = useState(false)

  // Back & Lay bet form state
  const [backLayBet, setBackLayBet] = useState({
    track: "",
    race: "",
    horse: "",
    backBookie: "",
    backOdds: "",
    backStake: "",
    layExchange: "",
    layOdds: "",
    layStake: "",
    commission: "5",
    liability: "",
    notes: "",
    promoDesc: "",
    maxStake: "",
  })

  // Single bet form state
  const [singleBet, setSingleBet] = useState({
    track: "",
    race: "",
    horse: "",
    betType: "win",
    odds: "",
    stake: "",
    bookie: "",
    notes: "",
    promoDesc: "",
    maxStake: "",
  })

  // Multi bet form state
  const [multiBet, setMultiBet] = useState({
    stake: "",
    bookie: "",
    promoDesc: "",
    maxStake: "",
  })

  const [legs, setLegs] = useState([
    { id: 1, track: "", race: "", horse: "", odds: "" },
    { id: 2, track: "", race: "", horse: "", odds: "" },
  ])

  // Available bonus bets
  const [availableBonusBets, setAvailableBonusBets] = useState({})

  // Promo usage tracking
  const [promoUsage, setPromoUsage] = useState({})

  // Initialize from localStorage if available
  useEffect(() => {
    const storedBonusBets = loadBonusBets()
    if (Object.keys(storedBonusBets).length > 0) {
      setAvailableBonusBets(storedBonusBets)
    }

    const storedPromoUsage = loadPromoUsage()
    if (Object.keys(storedPromoUsage).length > 0) {
      setPromoUsage(storedPromoUsage)
    } else {
      // Initialize with empty data
      const today = format(new Date(), "yyyy-MM-dd")
      const initialPromoUsage = {
        [today]: {},
      }
      savePromoUsage(initialPromoUsage)
      setPromoUsage(initialPromoUsage)
    }
  }, [])

  // Update single bet form
  const updateSingleBet = useCallback((field, value) => {
    setSingleBet((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Update multi bet form
  const updateMultiBet = useCallback((field, value) => {
    setMultiBet((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Update back & lay bet form
  const updateBackLayBet = useCallback((field, value) => {
    setBackLayBet((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Function to add a new leg
  const addLeg = useCallback(() => {
    setLegs((prevLegs) => {
      const newLegId = prevLegs.length > 0 ? Math.max(...prevLegs.map((leg) => leg.id)) + 1 : 1
      return [...prevLegs, { id: newLegId, track: "", race: "", horse: "", odds: "" }]
    })
  }, [])

  // Function to remove a leg
  const removeLeg = useCallback((legId) => {
    setLegs((prevLegs) => {
      if (prevLegs.length > 1) {
        return prevLegs.filter((leg) => leg.id !== legId)
      }
      return prevLegs
    })
  }, [])

  // Function to update leg data
  const updateLeg = useCallback((legId, field, value) => {
    setLegs((prevLegs) => prevLegs.map((leg) => (leg.id === legId ? { ...leg, [field]: value } : leg)))
  }, [])

  // Function to use a bonus bet
  const useBonusBet = useCallback(
    (bookie) => {
      if (!availableBonusBets[bookie] || availableBonusBets[bookie].amount <= 0) {
        return
      }

      setUsingBonusBet(true)
      setSelectedBonusBetAmount(availableBonusBets[bookie].amount)
      setBookieForBonus(bookie)

      // Update stake field based on bet type
      if (betType === "single") {
        updateSingleBet("stake", availableBonusBets[bookie].amount.toString())
        setIsStakeNotReturned(true) // Bonus bets are SNR
      } else if (betType === "multi") {
        updateMultiBet("stake", availableBonusBets[bookie].amount.toString())
      } else if (betType === "backlay") {
        updateBackLayBet("backStake", availableBonusBets[bookie].amount.toString())
        setIsStakeNotReturned(true) // Bonus bets are SNR
      }

      toast({
        title: "Bonus Bet Selected",
        description: `Using $${availableBonusBets[bookie].amount} bonus bet from ${bookie}`,
        variant: "success",
      })
    },
    [availableBonusBets, betType, toast, updateSingleBet, updateMultiBet, updateBackLayBet],
  )

  // Calculate suggested lay stake and outcomes
  const [suggestedLayStake, setSuggestedLayStake] = useState("")
  const [outcomeProfit, setOutcomeProfit] = useState({ back: 0, lay: 0 })
  const [returnPercentage, setReturnPercentage] = useState(0)
  const [turnoverEfficiency, setTurnoverEfficiency] = useState(0)

  // Calculate suggested lay stake and outcomes
  useEffect(() => {
    if (backLayBet.backStake && backLayBet.backOdds && backLayBet.layOdds && backLayBet.commission) {
      const backStake = Number.parseFloat(backLayBet.backStake)
      const backOdds = Number.parseFloat(backLayBet.backOdds)
      const layOdds = Number.parseFloat(backLayBet.layOdds)
      const commission = Number.parseFloat(backLayBet.commission) / 100

      // Calculate the optimal lay stake based on whether it's a bonus bet (SNR) or regular bet
      let optimalLayStake = 0

      if (isStakeNotReturned) {
        // For bonus bets (SNR), we want to make the profit equal regardless of outcome
        optimalLayStake = (backStake * (backOdds - 1)) / (layOdds - 1 + (1 - commission))
      } else {
        // For regular bets, we want to minimize the qualifying loss
        optimalLayStake = (backStake * backOdds) / (layOdds - commission)
      }

      setSuggestedLayStake(optimalLayStake.toFixed(2))

      // Calculate outcomes based on the ACTUAL lay stake if provided, otherwise use the suggested stake
      const actualLayStake = backLayBet.layStake ? Number.parseFloat(backLayBet.layStake) : optimalLayStake

      // Calculate liability
      const liability = actualLayStake * (layOdds - 1)

      // Update liability without triggering a re-render
      if (Math.abs(Number(backLayBet.liability) - liability) > 0.01) {
        updateBackLayBet("liability", liability.toFixed(2))
      }

      // Calculate profit for each outcome
      let backWinsProfit = 0
      let layWinsProfit = 0

      if (isStakeNotReturned) {
        // For bonus bets (SNR), the back stake is not returned if the back bet wins
        backWinsProfit = backStake * (backOdds - 1) - liability
        layWinsProfit = actualLayStake * (1 - commission) // No back stake lost since it's a bonus bet
      } else {
        // For regular bets, the back stake is returned if the back bet wins
        backWinsProfit = backStake * backOdds - backStake - liability
        layWinsProfit = actualLayStake * (1 - commission) - backStake
      }

      setOutcomeProfit({
        back: backWinsProfit.toFixed(2),
        lay: layWinsProfit.toFixed(2),
      })

      // Calculate metrics based on bet type
      if (isStakeNotReturned) {
        // For bonus bets, calculate turnover efficiency
        const guaranteedProfit = Math.min(backWinsProfit, layWinsProfit)
        const turnoverPct = (guaranteedProfit / backStake) * 100
        setTurnoverEfficiency(turnoverPct.toFixed(2))
        setReturnPercentage(turnoverPct.toFixed(2))
      } else {
        // For regular bets, calculate ROI
        const totalStake = backStake + liability
        const guaranteedProfit = Math.min(backWinsProfit, layWinsProfit)
        const returnPct = (guaranteedProfit / totalStake) * 100
        setReturnPercentage(returnPct.toFixed(2))
      }
    }
  }, [
    backLayBet.backStake,
    backLayBet.backOdds,
    backLayBet.layOdds,
    backLayBet.layStake,
    backLayBet.commission,
    isStakeNotReturned,
    updateBackLayBet,
  ])

  // Function to apply the suggested lay stake
  const applySuggestedStake = useCallback(() => {
    if (suggestedLayStake) {
      updateBackLayBet("layStake", suggestedLayStake)
    }
  }, [suggestedLayStake, updateBackLayBet])

  // Handle promo type selection
  const handlePromoTypeChange = useCallback(
    (value) => {
      setPromoType(value)

      // Set default values based on promo type
      if (value === "bonusForPlacing") {
        if (betType === "single") {
          updateSingleBet("promoDesc", "Bonus back for placing")
          updateSingleBet("betType", "place")
        } else if (betType === "backlay") {
          updateBackLayBet("promoDesc", "Bonus back for placing")
        }
      } else if (value === "bonusFor2nd") {
        if (betType === "single") {
          updateSingleBet("promoDesc", "Bonus back if 2nd")
          updateSingleBet("betType", "win")
        } else if (betType === "backlay") {
          updateBackLayBet("promoDesc", "Bonus back if 2nd")
        }
      } else if (value === "extraWinningsBonus") {
        if (betType === "single") {
          updateSingleBet("promoDesc", "Extra winnings paid as bonus")
          updateSingleBet("betType", "win")
        } else if (betType === "backlay") {
          updateBackLayBet("promoDesc", "Extra winnings paid as bonus")
        }
      }

      // Reset bonus triggered state when changing promo type
      setBonusTriggered(false)
    },
    [betType, updateSingleBet, updateBackLayBet],
  )

  // Initialize form data when in edit mode
  useEffect(() => {
    if (editMode && initialBet) {
      // Set the date
      if (initialBet.date) {
        const dateObj = new Date(initialBet.date)
        setDate(dateObj)
      }

      // Set bet type
      setBetType(initialBet.betType || "single")

      // Set promo flag
      setIsPromo(initialBet.isPromo || false)

      // Set promo type if available
      if (initialBet.promoType) {
        setPromoType(initialBet.promoType)
      }

      // Set bonus triggered flag
      setBonusTriggered(initialBet.bonusTriggered || false)

      // Set stake not returned flag for bonus bets
      setIsStakeNotReturned(initialBet.isBonus || false)

      // Initialize form data based on bet type
      if (initialBet.betType === "single") {
        setSingleBet({
          track: initialBet.track || "",
          race: initialBet.race || "",
          horse: initialBet.horse || "",
          betType: initialBet.betType || "win",
          odds: initialBet.odds?.toString() || "",
          stake: initialBet.stake?.toString() || "",
          bookie: initialBet.bookie || "",
          notes: initialBet.notes || "",
          promoDesc: initialBet.promoDesc || "",
          maxStake: initialBet.maxStake?.toString() || "",
        })
      } else if (initialBet.betType === "multi") {
        setMultiBet({
          stake: initialBet.stake?.toString() || "",
          bookie: initialBet.bookie || "",
          promoDesc: initialBet.promoDesc || "",
          maxStake: initialBet.maxStake?.toString() || "",
        })

        if (initialBet.legs) {
          setLegs(
            initialBet.legs.map((leg, index) => ({
              id: index + 1,
              track: leg.track || "",
              race: leg.race || "",
              horse: leg.horse || "",
              odds: leg.odds?.toString() || "",
            })),
          )
        }
      } else if (initialBet.betType === "backlay") {
        // Extract back bet details
        const backBet = {
          track: initialBet.track || "",
          race: initialBet.race || "",
          horse: initialBet.horse || "",
          backBookie: initialBet.bookie || "",
          backOdds: initialBet.odds?.toString() || "",
          backStake: initialBet.stake?.toString() || "",
          notes: initialBet.notes || "",
          promoDesc: initialBet.promoDesc || "",
          maxStake: initialBet.maxStake?.toString() || "",
          commission: "5",
          layExchange: "",
          layOdds: "",
          layStake: "",
          liability: "",
        }

        // Extract lay bet details from notes if available
        if (initialBet.notes) {
          const layMatch = initialBet.notes.match(
            /Lay: ([^@]+) @ ([^ ]+) - Stake: \$([^ ]+) - Liability: \$([^ ]+) - Commission: ([^%]+)%/,
          )
          if (layMatch) {
            backBet.layExchange = layMatch[1]
            backBet.layOdds = layMatch[2]
            backBet.layStake = layMatch[3]
            backBet.liability = layMatch[4]
            backBet.commission = layMatch[5]
          }
        }

        setBackLayBet(backBet)
      }

      // Set bonus bet value if available
      if (initialBet.bonusBetValue) {
        setSelectedBonusBetAmount(initialBet.bonusBetValue)
      }
    }
  }, [editMode, initialBet])

  // Function to save the bet
  const saveBet = useCallback(() => {
    let newBet = {
      id: editMode && initialBet ? initialBet.id : `HR-${Math.floor(Math.random() * 10000)}`,
      date: format(date, "yyyy-MM-dd"),
      time: format(date, "HH:mm"),
      status: editMode && initialBet ? initialBet.status : "active",
      profit: editMode && initialBet ? initialBet.profit : 0,
      bonusTriggered: bonusTriggered,
      bonusBetValue: selectedBonusBetAmount || (editMode && initialBet ? initialBet.bonusBetValue : 0),
    }

    if (betType === "single") {
      // Validate required fields
      if (!singleBet.track || !singleBet.horse || !singleBet.odds || !singleBet.stake || !singleBet.bookie) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      newBet = {
        ...newBet,
        track: singleBet.track,
        race: singleBet.race,
        horse: singleBet.horse,
        betType: singleBet.betType,
        odds: Number.parseFloat(singleBet.odds),
        stake: Number.parseFloat(singleBet.stake),
        bookie: singleBet.bookie,
        notes: singleBet.notes,
        isBonus: false,
        isPromo: isPromo, // Ensure this is set correctly
        promoType: isPromo ? promoType : undefined,
        promoDesc: isPromo ? singleBet.promoDesc || "" : undefined,
        maxStake: isPromo ? Number.parseFloat(singleBet.maxStake || "0") : undefined,
        bonusTriggered: false, // Always start as false for new bets
      }
      newBet.betType = "single"
    } else if (betType === "multi") {
      // Validate required fields
      if (!multiBet.stake || !multiBet.bookie) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Check if legs have data
      const invalidLegs = legs.some((leg) => !leg.track || !leg.horse || !leg.odds)
      if (invalidLegs) {
        toast({
          title: "Incomplete legs",
          description: "Please fill in all leg details",
          variant: "destructive",
        })
        return
      }

      const legDescriptions = legs.map((leg) => `${leg.horse} (${leg.track})`).join(", ")

      newBet = {
        ...newBet,
        track: "Multiple",
        race: "Multiple",
        horse: legDescriptions,
        odds: legs.reduce((total, leg) => total * Number.parseFloat(leg.odds || 1), 1).toFixed(2),
        stake: Number.parseFloat(multiBet.stake),
        bookie: multiBet.bookie,
        isBonus: false,
        legs: legs,
        isPromo: isPromo, // Ensure this is set correctly
        promoType: isPromo ? promoType : undefined,
        promoDesc: isPromo ? multiBet.promoDesc || "" : undefined,
        maxStake: isPromo ? Number.parseFloat(multiBet.maxStake || "0") : undefined,
        bonusTriggered: false, // Always start as false for new bets
      }
      newBet.betType = "multi"
    } else if (betType === "backlay") {
      // Validate required fields for back & lay
      if (
        !backLayBet.track ||
        !backLayBet.horse ||
        !backLayBet.backBookie ||
        !backLayBet.backOdds ||
        !backLayBet.backStake ||
        !backLayBet.layExchange ||
        !backLayBet.layOdds ||
        !backLayBet.layStake
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      newBet = {
        ...newBet,
        track: backLayBet.track,
        race: backLayBet.race,
        horse: backLayBet.horse,
        odds: Number.parseFloat(backLayBet.backOdds),
        stake: Number.parseFloat(backLayBet.backStake),
        bookie: backLayBet.backBookie,
        strategy: isStakeNotReturned ? "Bonus Bet Turnover" : "Back & Lay",
        notes: `${isStakeNotReturned ? "Bonus Bet SNR - " : ""}Lay: ${backLayBet.layExchange} @ ${backLayBet.layOdds} - Stake: $${backLayBet.layStake} - Liability: $${backLayBet.liability} - Commission: ${backLayBet.commission}%`,
        isBonus: isStakeNotReturned,
        backStatus: "active",
        layStatus: "active",
        isPromo: isPromo, // Ensure this is set correctly
        promoType: isPromo ? promoType : undefined,
        promoDesc: isPromo ? backLayBet.promoDesc || "" : undefined,
        maxStake: isPromo ? Number.parseFloat(backLayBet.maxStake || "0") : undefined,
        bonusTriggered: false, // Always start as false for new bets
      }
      newBet.betType = "backlay"
    }

    // If using a bonus bet, consume it from the available bonus bets
    if (usingBonusBet && bookieForBonus) {
      const bookie = bookieForBonus
      if (availableBonusBets[bookie]) {
        const newAmount = availableBonusBets[bookie].amount - Number(newBet.stake)
        const newCount = availableBonusBets[bookie].count - 1

        setAvailableBonusBets((prev) => {
          const updated = {
            ...prev,
            [bookie]: {
              ...prev[bookie],
              amount: Math.max(0, newAmount),
              count: Math.max(0, newCount),
            },
          }

          // If no more bonus bets for this bookie, remove it
          if (updated[bookie].count <= 0) {
            delete updated[bookie]
          }

          // Update localStorage
          saveBonusBets(updated)
          return updated
        })

        // Mark the bet as a bonus bet
        newBet.isBonus = true
        newBet.isStakeNotReturned = true
      }
    }

    // Track promo usage if this is a promo bet
    if (isPromo && !editMode) {
      const today = format(new Date(), "yyyy-MM-dd")
      const bookie = newBet.bookie
      const promoDescription = newBet.promoDesc

      setPromoUsage((prev) => {
        const updated = { ...prev }

        if (!updated[today]) {
          updated[today] = {}
        }

        if (!updated[today][bookie]) {
          updated[today][bookie] = []
        }

        updated[today][bookie].push({
          time: format(new Date(), "HH:mm"),
          type: promoType,
          description: promoDescription,
          horse: newBet.horse,
          track: newBet.track,
          race: newBet.race,
          stake: newBet.stake,
        })

        // Update localStorage
        savePromoUsage(updated)
        return updated
      })
    }

    // Call the onSaveBet function passed from the parent
    if (onSaveBet && typeof onSaveBet === "function") {
      onSaveBet(newBet)

      // Show success toast
      toast({
        title: editMode ? "Bet updated successfully" : "Bet added successfully",
        description: `Your ${betType} bet has been ${editMode ? "updated" : "added"} to your list`,
      })

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    }
  }, [
    date,
    editMode,
    initialBet,
    bonusTriggered,
    selectedBonusBetAmount,
    betType,
    singleBet,
    multiBet,
    legs,
    backLayBet,
    isPromo,
    promoType,
    isStakeNotReturned,
    usingBonusBet,
    bookieForBonus,
    availableBonusBets,
    toast,
    onSaveBet,
    onOpenChange,
  ])

  // Reset form fields
  const resetForm = useCallback(() => {
    setSingleBet({
      track: "",
      race: "",
      horse: "",
      betType: "win",
      odds: "",
      stake: "",
      bookie: "",
      notes: "",
      promoDesc: "",
      maxStake: "",
    })
    setMultiBet({
      stake: "",
      bookie: "",
      promoDesc: "",
      maxStake: "",
    })
    setBackLayBet({
      track: "",
      race: "",
      horse: "",
      backBookie: "",
      backOdds: "",
      backStake: "",
      layExchange: "",
      layOdds: "",
      layStake: "",
      commission: "5",
      liability: "",
      notes: "",
      promoDesc: "",
      maxStake: "",
    })
    setLegs([
      { id: 1, track: "", race: "", horse: "", odds: "" },
      { id: 2, track: "", race: "", horse: "", odds: "" },
    ])
    setDate(new Date())
    setIsPromo(false)
    setPromoType("")
    setBetType("single")
    setSuggestedLayStake("")
    setOutcomeProfit({ back: 0, lay: 0 })
    setReturnPercentage(0)
    setTurnoverEfficiency(0)
    setIsStakeNotReturned(false)
    setBonusTriggered(false)
    setUsingBonusBet(false)
    setSelectedBonusBetAmount(0)
    setBookieForBonus(null)
  }, [])

  const handleSingleBonusBet = useCallback(() => {
    if (singleBet.bookie) {
      useBonusBet(singleBet.bookie)
    }
  }, [singleBet.bookie, useBonusBet])

  const handleMultiBonusBet = useCallback(() => {
    if (multiBet.bookie) {
      useBonusBet(multiBet.bookie)
    }
  }, [multiBet.bookie, useBonusBet])

  const handleBackLayBonusBet = useCallback(() => {
    if (backLayBet.backBookie) {
      useBonusBet(backLayBet.backBookie)
    }
  }, [backLayBet.backBookie, useBonusBet])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Horse Racing Bet" : "Add Horse Racing Bet"}</DialogTitle>
          <DialogDescription>
            {editMode ? "Update the details of your horse racing bet" : "Record a new horse racing bet"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full" onValueChange={setBetType}>
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="single">Single Bet</TabsTrigger>
            <TabsTrigger value="multi">Multi/Parlay</TabsTrigger>
            <TabsTrigger value="backlay">Back & Lay</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-track">Track</Label>
                  <Input
                    id="single-track"
                    placeholder="e.g. Churchill Downs, Flemington"
                    value={singleBet.track}
                    onChange={(e) => updateSingleBet("track", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-race">Race</Label>
                  <Input
                    id="single-race"
                    placeholder="e.g. Race 5, Melbourne Cup"
                    value={singleBet.race}
                    onChange={(e) => updateSingleBet("race", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="single-horse">Horse</Label>
                <Input
                  id="single-horse"
                  placeholder="e.g. Lucky Strike"
                  value={singleBet.horse}
                  onChange={(e) => updateSingleBet("horse", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-bet-type">Bet Type</Label>
                  <Select
                    defaultValue={singleBet.betType}
                    value={singleBet.betType}
                    onValueChange={(value) => updateSingleBet("betType", value)}
                  >
                    <SelectTrigger id="single-bet-type">
                      <SelectValue placeholder="Select bet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="win">Win</SelectItem>
                      <SelectItem value="place">Place</SelectItem>
                      <SelectItem value="eachway">Each Way</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-odds">Odds</Label>
                  <Input
                    id="single-odds"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.5"
                    value={singleBet.odds}
                    onChange={(e) => updateSingleBet("odds", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-stake">Stake ($)</Label>
                  <Input
                    id="single-stake"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 100.00"
                    value={singleBet.stake}
                    onChange={(e) => updateSingleBet("stake", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-bookie">Bookmaker</Label>
                  <Select
                    value={singleBet.bookie || undefined}
                    onValueChange={(value) => updateSingleBet("bookie", value)}
                  >
                    <SelectTrigger id="single-bookie">
                      <SelectValue placeholder="Select bookmaker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bet365">Bet365</SelectItem>
                      <SelectItem value="Ladbrokes">Ladbrokes</SelectItem>
                      <SelectItem value="William Hill">William Hill</SelectItem>
                      <SelectItem value="Betfair">Betfair</SelectItem>
                      <SelectItem value="Unibet">Unibet</SelectItem>
                      <SelectItem value="Sportsbet">Sportsbet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-date">Date Placed</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {singleBet.bookie && availableBonusBets[singleBet.bookie] && (
                <div className="mt-2 p-2 border rounded-md bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">
                        ${availableBonusBets[singleBet.bookie].amount} Bonus Bet Available
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-purple-500 text-purple-600 hover:bg-purple-100"
                      onClick={handleSingleBonusBet}
                    >
                      Use Bonus Bet
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="single-notes">Notes</Label>
                <Input
                  id="single-notes"
                  placeholder="Any additional notes about this bet"
                  value={singleBet.notes}
                  onChange={(e) => updateSingleBet("notes", e.target.value)}
                />
              </div>

              <div className="space-y-4 border-t pt-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="single-is-promo"
                    checked={isPromo}
                    onCheckedChange={(checked) => setIsPromo(checked === true)}
                  />
                  <Label htmlFor="single-is-promo" className="text-sm font-medium">
                    Promotional Offer
                  </Label>
                </div>

                {isPromo && (
                  <div className="space-y-4 p-4 border rounded-md bg-purple-50/10 dark:bg-purple-900/10">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Promotional Offer Details</h3>
                    </div>

                    <RadioGroup value={promoType} onValueChange={handlePromoTypeChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bonusForPlacing" id="promo-placing" />
                        <Label htmlFor="promo-placing">Bonus Back for Placing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bonusFor2nd" id="promo-2nd" />
                        <Label htmlFor="promo-2nd">Bonus Back for 2nd</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="extraWinningsBonus" id="promo-extra" />
                        <Label htmlFor="promo-extra">Extra Winnings in Bonus</Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label htmlFor="single-promo-desc">Promotion Description</Label>
                      <Input
                        id="single-promo-desc"
                        placeholder="e.g. Money back if 2nd as bonus bet"
                        value={singleBet.promoDesc || ""}
                        onChange={(e) => updateSingleBet("promoDesc", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Describe the promotion for future reference</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="single-max-stake">Maximum Stake ($)</Label>
                      <Input
                        id="single-max-stake"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 50.00"
                        value={singleBet.maxStake || ""}
                        onChange={(e) => updateSingleBet("maxStake", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">The maximum stake allowed for this promotion</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="multi">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="multi-stake">Total Stake ($)</Label>
                  <Input
                    id="multi-stake"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 50.00"
                    value={multiBet.stake}
                    onChange={(e) => updateMultiBet("stake", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="multi-bookie">Bookmaker</Label>
                  <Select value={multiBet.bookie || undefined} onChange={(value) => updateMultiBet("bookie", value)}>
                    <SelectTrigger id="multi-bookie">
                      <SelectValue placeholder="Select bookmaker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bet365">Bet365</SelectItem>
                      <SelectItem value="Ladbrokes">Ladbrokes</SelectItem>
                      <SelectItem value="William Hill">William Hill</SelectItem>
                      <SelectItem value="Betfair">Betfair</SelectItem>
                      <SelectItem value="Unibet">Unibet</SelectItem>
                      <SelectItem value="Sportsbet">Sportsbet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {multiBet.bookie && availableBonusBets[multiBet.bookie] && (
                <div className="mt-2 p-2 border rounded-md bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">
                        ${availableBonusBets[multiBet.bookie].amount} Bonus Bet Available
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-purple-500 text-purple-600 hover:bg-purple-100"
                      onClick={handleMultiBonusBet}
                    >
                      Use Bonus Bet
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Legs</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLeg}>
                    Add Leg
                  </Button>
                </div>

                <div className="space-y-4">
                  {legs.map((leg, index) => (
                    <div key={leg.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Leg {index + 1}</h4>
                        {legs.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLeg(leg.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`leg-${leg.id}-track`}>Track</Label>
                          <Input
                            id={`leg-${leg.id}-track`}
                            placeholder="e.g. Flemington"
                            value={leg.track}
                            onChange={(e) => updateLeg(leg.id, "track", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`leg-${leg.id}-race`}>Race</Label>
                          <Input
                            id={`leg-${leg.id}-race`}
                            placeholder="e.g. Race 5"
                            value={leg.race}
                            onChange={(e) => updateLeg(leg.id, "race", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`leg-${leg.id}-horse`}>Horse</Label>
                          <Input
                            id={`leg-${leg.id}-horse`}
                            placeholder="e.g. Lucky Strike"
                            value={leg.horse}
                            onChange={(e) => updateLeg(leg.id, "horse", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`leg-${leg.id}-odds`}>Odds</Label>
                          <Input
                            id={`leg-${leg.id}-odds`}
                            type="number"
                            step="0.01"
                            placeholder="e.g. 2.10"
                            value={leg.odds}
                            onChange={(e) => updateLeg(leg.id, "odds", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="multi-date">Date Placed</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4 border-t pt-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multi-is-promo"
                    checked={isPromo}
                    onCheckedChange={(checked) => setIsPromo(checked === true)}
                  />
                  <Label htmlFor="multi-is-promo" className="text-sm font-medium">
                    Promotional Offer
                  </Label>
                </div>

                {isPromo && (
                  <div className="space-y-4 p-4 border rounded-md bg-purple-50/10 dark:bg-purple-900/10">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Promotional Offer Details</h3>
                    </div>

                    <RadioGroup value={promoType} onValueChange={handlePromoTypeChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bonusForPlacing" id="multi-promo-placing" />
                        <Label htmlFor="multi-promo-placing">Bonus Back for Placing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bonusFor2nd" id="multi-promo-2nd" />
                        <Label htmlFor="multi-promo-2nd">Bonus Back for 2nd</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="extraWinningsBonus" id="multi-promo-extra" />
                        <Label htmlFor="multi-promo-extra">Extra Winnings in Bonus</Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label htmlFor="multi-promo-desc">Promotion Description</Label>
                      <Input
                        id="multi-promo-desc"
                        placeholder="e.g. Multi boost 25% extra odds"
                        value={multiBet.promoDesc || ""}
                        onChange={(e) => updateMultiBet("promoDesc", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Describe the promotion for future reference</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="multi-max-stake">Maximum Stake ($)</Label>
                      <Input
                        id="multi-max-stake"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 50.00"
                        value={multiBet.maxStake || ""}
                        onChange={(e) => updateMultiBet("maxStake", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">The maximum stake allowed for this promotion</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Multi Summary</h3>
                  <div className="text-sm text-muted-foreground">
                    {legs.filter((leg) => leg.odds).length} of {legs.length} legs with odds
                  </div>
                </div>

                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Total Odds:</span>
                    <span className="font-medium">
                      {legs.reduce((total, leg) => total * (Number(leg.odds) || 1), 1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Return:</span>
                    <span className="font-medium">
                      $
                      {multiBet.stake && legs.some((leg) => leg.odds)
                        ? (
                            Number(multiBet.stake) * legs.reduce((total, leg) => total * (Number(leg.odds) || 1), 1)
                          ).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Profit:</span>
                    <span className="font-medium text-green-600">
                      $
                      {multiBet.stake && legs.some((leg) => leg.odds)
                        ? (
                            Number(multiBet.stake) * legs.reduce((total, leg) => total * (Number(leg.odds) || 1), 1) -
                            Number(multiBet.stake)
                          ).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backlay">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backlay-track">Track</Label>
                  <Input
                    id="backlay-track"
                    placeholder="e.g. Churchill Downs, Flemington"
                    value={backLayBet.track}
                    onChange={(e) => updateBackLayBet("track", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backlay-race">Race</Label>
                  <Input
                    id="backlay-race"
                    placeholder="e.g. Race 5, Melbourne Cup"
                    value={backLayBet.race}
                    onChange={(e) => updateBackLayBet("race", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backlay-horse">Horse</Label>
                <Input
                  id="backlay-horse"
                  placeholder="e.g. Lucky Strike"
                  value={backLayBet.horse}
                  onChange={(e) => updateBackLayBet("horse", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-medium text-lg">Back Bet</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="back-bookie">Bookmaker</Label>
                        <Select
                          value={backLayBet.backBookie || undefined}
                          onChange={(value) => updateBackLayBet("backBookie", value)}
                        >
                          <SelectTrigger id="back-bookie">
                            <SelectValue placeholder="Select bookmaker" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bet365">Bet365</SelectItem>
                            <SelectItem value="Ladbrokes">Ladbrokes</SelectItem>
                            <SelectItem value="William Hill">William Hill</SelectItem>
                            <SelectItem value="Sportsbet">Sportsbet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {backLayBet.backBookie && availableBonusBets[backLayBet.backBookie] && (
                        <div className="p-2 border rounded-md bg-purple-50 dark:bg-purple-900/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium">
                                ${availableBonusBets[backLayBet.backBookie].amount} Bonus Bet Available
                              </span>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-purple-500 text-purple-600 hover:bg-purple-100"
                              onClick={handleBackLayBonusBet}
                            >
                              Use Bonus Bet
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="back-stake" className="flex items-center">
                          Back Stake ($)
                          {isStakeNotReturned && <Gift className="h-4 w-4 ml-1 text-purple-500" title="Bonus Bet" />}
                        </Label>
                        <Input
                          id="back-stake"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 100.00"
                          value={backLayBet.backStake}
                          onChange={(e) => updateBackLayBet("backStake", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stake-not-returned"
                          checked={isStakeNotReturned}
                          onCheckedChange={(checked) => setIsStakeNotReturned(checked === true)}
                        />
                        <Label htmlFor="stake-not-returned" className="text-sm font-medium">
                          Bonus Bet SNR (Stake Not Returned)
                        </Label>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="back-odds">Back Odds</Label>
                        <Input
                          id="back-odds"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 2.10"
                          value={backLayBet.backOdds}
                          onChange={(e) => updateBackLayBet("backOdds", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-medium text-lg">Lay Bet</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lay-exchange">Exchange</Label>
                        <Select
                          value={backLayBet.layExchange || undefined}
                          onChange={(value) => updateBackLayBet("layExchange", value)}
                        >
                          <SelectTrigger id="lay-exchange">
                            <SelectValue placeholder="Select exchange" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Betfair">Betfair</SelectItem>
                            <SelectItem value="Smarkets">Smarkets</SelectItem>
                            <SelectItem value="Matchbook">Matchbook</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="lay-stake">Lay Stake ($)</Label>
                          <Input
                            id="lay-stake"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 95.45"
                            value={backLayBet.layStake}
                            onChange={(e) => updateBackLayBet("layStake", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="suggested-stake">Suggested Stake</Label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                              {suggestedLayStake ? `$${suggestedLayStake}` : "-"}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-10 whitespace-nowrap"
                              onClick={applySuggestedStake}
                              disabled={!suggestedLayStake}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lay-odds">Lay Odds</Label>
                        <Input
                          id="lay-odds"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 2.20"
                          value={backLayBet.layOdds}
                          onChange={(e) => updateBackLayBet("layOdds", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="commission">Commission (%)</Label>
                          <Input
                            id="commission"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 5.0"
                            value={backLayBet.commission}
                            onChange={(e) => updateBackLayBet("commission", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="liability">Liability ($)</Label>
                          <div className="space-y-1">
                            <Input
                              id="liability"
                              type="number"
                              step="0.01"
                              placeholder="Calculated"
                              value={backLayBet.liability}
                              disabled
                            />
                            <p className="text-xs text-muted-foreground">
                              You will need {backLayBet.liability ? `$${backLayBet.liability}` : "liability"} on{" "}
                              {backLayBet.layExchange || "selected exchange"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border rounded-md p-4 space-y-4 bg-muted/30">
                <h3 className="font-medium">
                  {isStakeNotReturned ? "Bonus Bet Turnover Analysis" : "Outcome Analysis"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 border-r pr-4">
                    <p className="text-sm font-medium">If Bet Wins at Bookmaker:</p>
                    <p
                      className={`text-lg font-bold ${outcomeProfit.back ? (Number.parseFloat(outcomeProfit.back) >= 0 ? "text-green-600" : "text-red-600") : ""}`}
                    >
                      {outcomeProfit.back
                        ? (Number.parseFloat(outcomeProfit.back) >= 0 ? "+" : "") + "$" + outcomeProfit.back
                        : "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isStakeNotReturned
                        ? "Bonus bet wins (stake not returned) minus lay liability"
                        : "Back bet returns minus lay liability"}
                    </p>
                  </div>
                  <div className="space-y-1 pl-4">
                    <p className="text-sm font-medium">If Bet Wins at Exchange:</p>
                    <p
                      className={`text-lg font-bold ${outcomeProfit.lay ? (Number.parseFloat(outcomeProfit.lay) >= 0 ? "text-green-600" : "text-red-600") : ""}`}
                    >
                      {outcomeProfit.lay
                        ? (Number.parseFloat(outcomeProfit.lay) >= 0 ? "+" : "") + "$" + outcomeProfit.lay
                        : "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isStakeNotReturned
                        ? "Lay bet wins (minus commission)"
                        : "Lay bet wins (minus commission) minus back stake"}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  {isStakeNotReturned ? (
                    <div>
                      <p className="text-sm font-medium">Bonus Turnover Efficiency:</p>
                      <p
                        className={`text-lg font-bold ${turnoverEfficiency ? (Number.parseFloat(turnoverEfficiency) >= 0 ? "text-green-600" : "text-red-600") : ""}`}
                      >
                        {turnoverEfficiency
                          ? (Number.parseFloat(turnoverEfficiency) >= 0 ? "+" : "") +
                            turnoverEfficiency +
                            "% of bonus converted to cash"
                          : "-"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The percentage of your bonus bet that is guaranteed to be converted to withdrawable cash.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">Return on Investment:</p>
                      <p
                        className={`text-lg font-bold ${returnPercentage ? (Number.parseFloat(returnPercentage) >= 0 ? "text-green-600" : "text-red-600") : ""}`}
                      >
                        {returnPercentage
                          ? (Number.parseFloat(returnPercentage) >= 0 ? "+" : "") + returnPercentage + "%"
                          : "-"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ROI based on total investment (back stake + lay liability).
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backlay-date">Date Placed</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backlay-notes">Notes</Label>
                <Input
                  id="backlay-notes"
                  placeholder="Any additional notes about this back & lay bet"
                  value={backLayBet.notes}
                  onChange={(e) => updateBackLayBet("notes", e.target.value)}
                />
              </div>

              <div className="space-y-4 border-t pt-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="backlay-is-promo"
                    checked={isPromo}
                    onCheckedChange={(checked) => setIsPromo(checked === true)}
                  />
                  <Label htmlFor="backlay-is-promo" className="text-sm font-medium">
                    Promotional Offer
                  </Label>
                </div>

                {isPromo && (
                  <div className="space-y-4 p-4 border rounded-md bg-purple-50/10 dark:bg-purple-900/10">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Promotional Offer Details</h3>
                    </div>

                    <RadioGroup value={promoType} onValueChange={handlePromoTypeChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bonusForPlacing" id="backlay-promo-placing" />
                        <Label htmlFor="backlay-promo-placing">Bonus Back for Placing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bonusFor2nd" id="backlay-promo-2nd" />
                        <Label htmlFor="backlay-promo-2nd">Bonus Back for 2nd</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="extraWinningsBonus" id="backlay-promo-extra" />
                        <Label htmlFor="backlay-promo-extra">Extra Winnings in Bonus</Label>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label htmlFor="backlay-promo-desc">Promotion Description</Label>
                      <Input
                        id="backlay-promo-desc"
                        placeholder="e.g. Early payout if team leads by 2 goals"
                        value={backLayBet.promoDesc || ""}
                        onChange={(e) => updateBackLayBet("promoDesc", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Describe the promotion for future reference</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backlay-max-stake">Maximum Stake ($)</Label>
                      <Input
                        id="backlay-max-stake"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 50.00"
                        value={backLayBet.maxStake || ""}
                        onChange={(e) => updateBackLayBet("maxStake", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">The maximum stake allowed for this promotion</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveBet}>{editMode ? "Update Bet" : "Save Bet"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
