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
import React from "react"

export function AddBetDialog({ open, onOpenChange, onAddBet, editMode = false, initialBet = null }) {
  const { toast } = useToast()
  const [betType, setBetType] = useState("single")
  const [date, setDate] = useState(new Date())
  const [isPromo, setIsPromo] = useState(false)
  const [isLayBet, setIsLayBet] = useState(false)
  const [isArbitrage, setIsArbitrage] = useState(false)
  const [isDutching, setIsDutching] = useState(false)
  const [isStakeNotReturned, setIsStakeNotReturned] = useState(false)
  const [bonusTriggered, setBonusTriggered] = useState(false)
  const [multiType, setMultiType] = useState("normal") // "normal" or "samegame"

  // Back & Lay bet form state
  const [backLayBet, setBackLayBet] = useState({
    event: "",
    selection: "",
    backBookie: "",
    backOdds: "",
    backStake: "",
    layExchange: "",
    layOdds: "",
    layStake: "",
    commission: "5",
    liability: "",
    sport: "",
    notes: "",
    tipper: "", // Add tipper field
    promoDesc: "",
    maxStake: "",
  })

  // Single bet form state
  const [singleBet, setSingleBet] = useState({
    event: "",
    selection: "",
    odds: "",
    stake: "",
    bookie: "",
    sport: "",
    strategy: "",
    tipper: "",
    notes: "",
    targetProfit: "",
    promoDesc: "",
    maxStake: "",
  })

  const [legs, setLegs] = useState([
    { id: 1, event: "", selection: "", odds: "", stake: "" },
    { id: 2, event: "", selection: "", odds: "", stake: "" },
    { id: 3, event: "", selection: "", odds: "", stake: "" },
  ])

  // Multi bet form state
  const [multiBet, setMultiBet] = useState({
    stake: "",
    bookie: "",
    strategy: "",
    promoDesc: "",
    maxStake: "",
  })

  const [selections, setSelections] = useState([
    { id: 1, event: "", selection: "", odds: "", stake: "" },
    { id: 2, event: "", selection: "", odds: "", stake: "" },
    { id: 3, event: "", selection: "", odds: "", stake: "" },
    { id: 4, event: "", selection: "", odds: "", stake: "" },
  ])

  // System bet form state
  const [systemBet, setSystemBet] = useState({
    systemType: "",
    unitStake: "",
    bookie: "",
  })

  const [manualCombinedOdds, setManualCombinedOdds] = useState("")

  const calculateCombinedOdds = () => {
    return legs
      .filter((leg) => leg.odds)
      .reduce((total, leg) => total * Number.parseFloat(leg.odds || 1), 1)
      .toFixed(2)
  }

  // Update single bet form
  const updateSingleBet = useCallback(
    (field, value) => {
      setSingleBet({
        ...singleBet,
        [field]: value,
      })
    },
    [singleBet],
  )

  // Update multi bet form
  const updateMultiBet = useCallback(
    (field, value) => {
      setMultiBet({
        ...multiBet,
        [field]: value,
      })
    },
    [multiBet],
  )

  // Update system bet form
  const updateSystemBet = (field, value) => {
    setSystemBet({
      ...systemBet,
      [field]: value,
    })
  }

  // Update back & lay bet form
  const updateBackLayBet = useCallback(
    (field, value) => {
      setBackLayBet({
        ...backLayBet,
        [field]: value,
      })
    },
    [backLayBet],
  )

  // Add these state variables
  const [availableBonusBets, setAvailableBonusBets] = useState({})
  const [usingBonusBet, setUsingBonusBet] = useState(false)
  const [selectedBonusBetAmount, setSelectedBonusBetAmount] = useState(0)
  const [bookieForBonus, setBookieForBonus] = useState(null)

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
    [availableBonusBets, betType, setIsStakeNotReturned, toast, updateMultiBet, updateSingleBet, updateBackLayBet],
  )

  // Add effect to listen for and track bonus bets
  useEffect(() => {
    // Initialize from localStorage if available
    const storedBonusBets = localStorage.getItem("bonusBets")
    if (storedBonusBets) {
      setAvailableBonusBets(JSON.parse(storedBonusBets))
    }

    const handleBonusBetTriggered = (event) => {
      const { bookie, amount } = event.detail
      setAvailableBonusBets((prev) => {
        const newBonusBets = {
          ...prev,
          [bookie]: {
            amount: (prev[bookie]?.amount || 0) + Number(amount),
            count: (prev[bookie]?.count || 0) + 1,
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        }
        // Store in localStorage for persistence
        localStorage.setItem("bonusBets", JSON.stringify(newBonusBets))
        return newBonusBets
      })
    }

    window.addEventListener("bonusBetTriggered", handleBonusBetTriggered)
    return () => {
      window.removeEventListener("bonusBetTriggered", handleBonusBetTriggered)
    }
  }, [])

  // Initialize form data when in edit mode
  React.useEffect(() => {
    if (editMode && initialBet) {
      // Set the date
      if (initialBet.date) {
        const [year, month, day] = initialBet.date.split("-").map(Number)
        const time = initialBet.time || "00:00"
        const [hours, minutes] = time.split(":").map(Number)
        const dateObj = new Date(year, month - 1, day, hours, minutes)
        setDate(dateObj)
      }

      // Set bet type
      setBetType(initialBet.betType || "single")

      // Set promo flag
      setIsPromo(initialBet.isPromo || false)

      // Set bonus triggered flag
      setBonusTriggered(initialBet.bonusTriggered || false)

      // Set stake not returned flag for bonus bets
      setIsStakeNotReturned(initialBet.isBonus || false)

      // Initialize form data based on bet type
      if (initialBet.betType === "single") {
        setSingleBet({
          event: initialBet.event || "",
          selection: initialBet.selection || "",
          odds: initialBet.odds?.toString() || "",
          stake: initialBet.stake?.toString() || "",
          bookie: initialBet.bookie || "",
          sport: initialBet.sport || "",
          strategy: initialBet.strategy || "",
          tipper: initialBet.tipper || "",
          notes: initialBet.notes || "",
          targetProfit: "",
          promoDesc: initialBet.promoDesc || "",
          maxStake: initialBet.maxStake?.toString() || "",
        })
      } else if (initialBet.betType === "multi") {
        setMultiBet({
          stake: initialBet.stake?.toString() || "",
          bookie: initialBet.bookie || "",
          strategy: initialBet.strategy || "",
          promoDesc: initialBet.promoDesc || "",
          maxStake: initialBet.maxStake?.toString() || "",
        })

        if (initialBet.legs) {
          setLegs(
            initialBet.legs.map((leg, index) => ({
              id: index + 1,
              event: leg.event || "",
              selection: leg.selection || "",
              odds: leg.odds?.toString() || "",
              stake: leg.stake?.toString() || "",
            })),
          )
        }
      } else if (initialBet.betType === "system") {
        setSystemBet({
          systemType: initialBet.systemType || "",
          unitStake: initialBet.unitStake?.toString() || "",
          bookie: initialBet.bookie || "",
        })

        if (initialBet.selections) {
          setSelections(
            initialBet.selections.map((sel, index) => ({
              id: index + 1,
              event: sel.event || "",
              selection: sel.selection || "",
              odds: sel.odds?.toString() || "",
              stake: sel.stake?.toString() || "",
            })),
          )
        }
      } else if (initialBet.betType === "backlay") {
        // Extract back bet details
        const backBet = {
          event: initialBet.event || "",
          selection: initialBet.selection || "",
          backBookie: initialBet.bookie || "",
          backOdds: initialBet.odds?.toString() || "",
          backStake: initialBet.stake?.toString() || "",
          sport: initialBet.sport || "",
          notes: initialBet.notes || "",
          tipper: initialBet.tipper || "",
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

  // Calculate suggested lay stake and outcomes
  const [suggestedLayStake, setSuggestedLayStake] = useState("")
  const [outcomeProfit, setOutcomeProfit] = useState({ back: 0, lay: 0 })
  const [returnPercentage, setReturnPercentage] = useState(0)
  const [turnoverEfficiency, setTurnoverEfficiency] = useState(0)

  useEffect(() => {
    // Calculate suggested lay stake and outcomes when relevant fields are provided
    if (backLayBet.backStake && backLayBet.backOdds && backLayBet.layOdds && backLayBet.commission) {
      const backStake = Number.parseFloat(backLayBet.backStake)
      const backOdds = Number.parseFloat(backLayBet.backOdds)
      const layOdds = Number.parseFloat(backLayBet.layOdds)
      const commission = Number.parseFloat(backLayBet.commission) / 100

      // Calculate the optimal lay stake based on whether it's a bonus bet (SNR) or regular bet
      let optimalLayStake = 0

      if (isStakeNotReturned) {
        // For bonus bets (SNR), we want to make the profit equal regardless of outcome
        // If back wins: backStake * (backOdds - 1) - layLiability
        // If lay wins: layStake * (1 - commission)
        // Setting these equal and solving for layStake:
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
      updateBackLayBet("liability", liability.toFixed(2))

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
        // For bonus bets, calculate turnover efficiency (how much of the bonus is converted to cash)
        // We use the minimum of the two outcomes as the guaranteed profit
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

  // Function to add a new leg
  const addLeg = () => {
    const newLegId = legs.length > 0 ? Math.max(...legs.map((leg) => leg.id)) + 1 : 1
    setLegs([...legs, { id: newLegId, event: "", selection: "", odds: "", stake: "" }])
  }

  // Function to remove a leg
  const removeLeg = (legId) => {
    if (legs.length > 1) {
      setLegs(legs.filter((leg) => leg.id !== legId))
    }
  }

  // Function to update leg data
  const updateLeg = (legId, field, value) => {
    setLegs(legs.map((leg) => (leg.id === legId ? { ...leg, [field]: value } : leg)))
  }

  // Function to add a new selection
  const addSelection = () => {
    const newSelectionId = selections.length > 0 ? Math.max(...selections.map((sel) => sel.id)) + 1 : 1
    setSelections([...selections, { id: newSelectionId, event: "", selection: "", odds: "", stake: "" }])
  }

  // Function to remove a selection
  const removeSelection = (selectionId) => {
    if (selections.length > 3) {
      // Keep at least 3 selections for system bets
      setSelections(selections.filter((sel) => sel.id !== selectionId))
    }
  }

  // Function to update selection data
  const updateSelection = (selectionId, field, value) => {
    setSelections(selections.map((sel) => (sel.id === selectionId ? { ...sel, [field]: value } : sel)))
  }

  // Function to save the bet
  const saveBet = () => {
    let newBet = {
      id: editMode && initialBet ? initialBet.id : `BET-${Math.floor(Math.random() * 10000)}`,
      date: format(date, "yyyy-MM-dd"),
      time: format(date, "HH:mm"),
      status: editMode && initialBet ? initialBet.status : "active",
      profit: editMode && initialBet ? initialBet.profit : 0,
      bonusTriggered: bonusTriggered,
      bonusBetValue: selectedBonusBetAmount || (editMode && initialBet ? initialBet.bonusBetValue : 0),
    }

    if (betType === "single") {
      // Validate required fields
      if (!singleBet.event || !singleBet.selection || !singleBet.odds || !singleBet.stake || !singleBet.bookie) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      newBet = {
        ...newBet,
        event: singleBet.event,
        selection: singleBet.selection,
        odds: Number.parseFloat(singleBet.odds),
        stake: Number.parseFloat(singleBet.stake),
        bookie: singleBet.bookie,
        sport: singleBet.sport || "Other",
        strategy: singleBet.strategy || "Other",
        tipper: singleBet.tipper || "Self",
        notes: singleBet.notes,
        isBonus: false,
        ...(isPromo && {
          isPromo: true,
          promoDesc: singleBet.promoDesc || "",
          maxStake: Number.parseFloat(singleBet.maxStake || "0"),
          bonusTriggered: false,
        }),
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
      const invalidLegs = legs.some((leg) => !leg.event || !leg.selection || !leg.odds)
      if (invalidLegs) {
        toast({
          title: "Incomplete legs",
          description: "Please fill in all leg details",
          variant: "destructive",
        })
        return
      }

      const legDescriptions = legs
        .map((leg) => `${leg.selection} (${multiType === "samegame" ? multiBet.event : leg.event})`)
        .join(", ")

      newBet = {
        ...newBet,
        event: multiType === "samegame" ? multiBet.event : "Multi Bet",
        selection: legDescriptions,
        odds: manualCombinedOdds
          ? Number.parseFloat(manualCombinedOdds)
          : legs.reduce((total, leg) => total * Number.parseFloat(leg.odds || 1), 1).toFixed(2),
        stake: Number.parseFloat(multiBet.stake),
        bookie: multiBet.bookie,
        sport: "Multiple",
        strategy: multiBet.strategy || "Multi/Parlay",
        tipper: "Self",
        isBonus: false,
        legs: legs,
        ...(isPromo && {
          isPromo: true,
          promoDesc: multiBet.promoDesc || "",
          maxStake: Number.parseFloat(multiBet.maxStake || "0"),
          bonusTriggered: false,
        }),
      }
      newBet.betType = "multi"
    } else if (betType === "system") {
      // Validate required fields
      if (!systemBet.systemType || !systemBet.unitStake || !systemBet.bookie) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Check if selections have data
      const invalidSelections = selections.some((sel) => !sel.event || !sel.selection || !sel.odds)
      if (invalidSelections) {
        toast({
          title: "Incomplete selections",
          description: "Please fill in all selection details",
          variant: "destructive",
        })
        return
      }

      const selectionDescriptions = selections.map((sel) => `${sel.selection} (${sel.event})`).join(", ")

      newBet = {
        ...newBet,
        event: `${systemBet.systemType} System Bet`,
        selection: selectionDescriptions,
        odds: "Various",
        stake:
          Number.parseFloat(systemBet.unitStake) *
          (systemBet.systemType === "trixie"
            ? 4
            : systemBet.systemType === "patent"
              ? 7
              : systemBet.systemType === "yankee"
                ? 11
                : systemBet.systemType === "lucky15"
                  ? 15
                  : systemBet.systemType === "canadian"
                    ? 26
                    : systemBet.systemType === "lucky31"
                      ? 31
                      : 57),
        bookie: systemBet.bookie,
        sport: "Multiple",
        strategy: "System Bet",
        tipper: "Self",
        isBonus: false,
        selections: selections,
      }
      newBet.betType = "system"
    } else if (betType === "backlay") {
      // Validate required fields for back & lay
      if (
        !backLayBet.event ||
        !backLayBet.selection ||
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
        event: backLayBet.event,
        selection: backLayBet.selection,
        odds: Number.parseFloat(backLayBet.backOdds),
        stake: Number.parseFloat(backLayBet.backStake),
        bookie: backLayBet.backBookie,
        sport: backLayBet.sport || "Other",
        strategy: isStakeNotReturned ? "Bonus Bet Turnover" : "Back & Lay",
        tipper: backLayBet.tipper || "Self",
        notes: `${isStakeNotReturned ? "Bonus Bet SNR - " : ""}Lay: ${backLayBet.layExchange} @ ${backLayBet.layOdds} - Stake: $${backLayBet.layStake} - Liability: $${backLayBet.liability} - Commission: ${backLayBet.commission}%`,
        isBonus: isStakeNotReturned,
        backStatus: "active",
        layStatus: "active",
        ...(isPromo && {
          isPromo: true,
          promoDesc: backLayBet.promoDesc || "",
          maxStake: Number.parseFloat(backLayBet.maxStake || "0"),
          bonusTriggered: false,
        }),
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
          localStorage.setItem("bonusBets", JSON.stringify(updated))
          return updated
        })

        // Mark the bet as a bonus bet
        newBet.isBonus = true
        newBet.isStakeNotReturned = true
      }
    }

    // Call the onAddBet function passed from the parent
    if (onAddBet && typeof onAddBet === "function") {
      try {
        // Log the bet data for debugging
        console.log("Saving bet data:", newBet)

        onAddBet(newBet)

        // Show success toast
        toast({
          title: editMode ? "Bet updated successfully" : "Bet added successfully",
          description: `Your ${betType} bet has been ${editMode ? "updated" : "added"} to your list`,
        })

        // Reset form and close dialog
        resetForm()
        onOpenChange(false)
      } catch (error) {
        console.error("Error saving bet:", error)
        toast({
          title: "Error saving bet",
          description: "There was a problem saving your bet. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      console.error("onAddBet is not a function or is undefined:", onAddBet)
      toast({
        title: "Cannot save bet",
        description: "The save function is not available. Please refresh the page and try again.",
        variant: "destructive",
      })
    }
  }

  // Reset form fields
  const resetForm = () => {
    setSingleBet({
      event: "",
      selection: "",
      odds: "",
      stake: "",
      bookie: "",
      sport: "",
      strategy: "",
      tipper: "",
      notes: "",
      targetProfit: "",
      promoDesc: "",
      maxStake: "",
    })
    setMultiBet({
      stake: "",
      bookie: "",
      strategy: "",
      promoDesc: "",
      maxStake: "",
    })
    setSystemBet({
      systemType: "",
      unitStake: "",
      bookie: "",
    })
    setBackLayBet({
      event: "",
      selection: "",
      backBookie: "",
      backOdds: "",
      backStake: "",
      layExchange: "",
      layOdds: "",
      layStake: "",
      commission: "5",
      liability: "",
      sport: "",
      notes: "",
      tipper: "",
      promoDesc: "",
      maxStake: "",
    })
    setLegs([
      { id: 1, event: "", selection: "", odds: "", stake: "" },
      { id: 2, event: "", selection: "", odds: "", stake: "" },
      { id: 3, event: "", selection: "", odds: "", stake: "" },
    ])
    setSelections([
      { id: 1, event: "", selection: "", odds: "", stake: "" },
      { id: 2, event: "", selection: "", odds: "", stake: "" },
      { id: 3, event: "", selection: "", odds: "", stake: "" },
      { id: 4, event: "", selection: "", odds: "", stake: "" },
    ])
    setDate(new Date())
    setIsPromo(false)
    setIsLayBet(false)
    setIsArbitrage(false)
    setIsDutching(false)
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
    setMultiType("normal")
    setManualCombinedOdds("")
  }

  // Function to apply the suggested lay stake
  const applySuggestedStake = () => {
    if (suggestedLayStake) {
      updateBackLayBet("layStake", suggestedLayStake)
    }
  }

  const handleUseBonusBet = useCallback(
    (bookie) => {
      useBonusBet(bookie)
    },
    [useBonusBet],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Bet" : "Add New Bet"}</DialogTitle>
          <DialogDescription>
            {editMode ? "Update the details of your bet" : "Record a new bet in your tracking system"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full" onValueChange={setBetType}>
          <TabsList className="mb-6 grid w-full grid-cols-6">
            <TabsTrigger value="single">Single Bet</TabsTrigger>
            <TabsTrigger value="multi">Multi/Parlay</TabsTrigger>
            <TabsTrigger value="system">System Bet</TabsTrigger>
            <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
            <TabsTrigger value="dutching">Dutching</TabsTrigger>
            <TabsTrigger value="backlay">Back & Lay</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-event">Event</Label>
                  <Input
                    id="single-event"
                    placeholder="e.g. Lakers vs Warriors"
                    value={singleBet.event}
                    onChange={(e) => updateSingleBet("event", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-sport">Sport</Label>
                  <Select onValueChange={(value) => updateSingleBet("sport", value)}>
                    <SelectTrigger id="single-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="MMA">MMA</SelectItem>
                      <SelectItem value="Boxing">Boxing</SelectItem>
                      <SelectItem value="Golf">Golf</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Horse Racing">Horse Racing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="single-selection">Selection</Label>
                <Input
                  id="single-selection"
                  placeholder="e.g. Lakers to win"
                  value={singleBet.selection}
                  onChange={(e) => updateSingleBet("selection", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-odds">Odds</Label>
                  <Input
                    id="single-odds"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 2.10"
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
                <div className="space-y-2">
                  <Label htmlFor="single-bookie">Bookmaker</Label>
                  <Select onValueChange={(value) => updateSingleBet("bookie", value)}>
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
                      onClick={() => handleUseBonusBet(singleBet.bookie)}
                    >
                      Use Bonus Bet
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-strategy">Betting Strategy</Label>
                  <Select onValueChange={(value) => updateSingleBet("strategy", value)}>
                    <SelectTrigger id="single-strategy">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Value Betting">Value Betting</SelectItem>
                      <SelectItem value="Backing Favorites">Backing Favorites</SelectItem>
                      <SelectItem value="Handicap Betting">Handicap Betting</SelectItem>
                      <SelectItem value="Over/Under">Over/Under</SelectItem>
                      <SelectItem value="BTTS">Both Teams to Score</SelectItem>
                      <SelectItem value="Prop Betting">Prop Betting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-tipper">Tipper/Source</Label>
                  <Select onValueChange={(value) => updateSingleBet("tipper", value)}>
                    <SelectTrigger id="single-tipper">
                      <SelectValue placeholder="Select tipper" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self">Self</SelectItem>
                      <SelectItem value="SportsTips Pro">SportsTips Pro</SelectItem>
                      <SelectItem value="Tennis Insider">Tennis Insider</SelectItem>
                      <SelectItem value="MLB Expert">MLB Expert</SelectItem>
                      <SelectItem value="UFC Predictions">UFC Predictions</SelectItem>
                      <SelectItem value="Premier League Tips">Premier League Tips</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="single-promo-desc">Promotion Description</Label>
                      <Input
                        id="single-promo-desc"
                        placeholder="e.g. Bet $50 get $50 bonus bet"
                        value={singleBet.promoDesc || ""}
                        onChange={(e) => updateSingleBet("promoDesc", e.target.value)}
                      />
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
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="multi">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2 p-1 border rounded-lg bg-muted/20">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    multiType === "normal" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => setMultiType("normal")}
                >
                  Normal Multi
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    multiType === "samegame" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => setMultiType("samegame")}
                >
                  Same Game Multi
                </button>
              </div>
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
                  <Select onValueChange={(value) => updateMultiBet("bookie", value)}>
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
                      onClick={() => handleUseBonusBet(multiBet.bookie)}
                    >
                      Use Bonus Bet
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{multiType === "samegame" ? "Selections" : "Legs"}</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLeg}>
                    Add {multiType === "samegame" ? "Selection" : "Leg"}
                  </Button>
                </div>

                {multiType === "samegame" && (
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="multi-event">Event</Label>
                    <Input
                      id="multi-event"
                      placeholder="e.g. Lakers vs Warriors"
                      value={multiBet.event || ""}
                      onChange={(e) => updateMultiBet("event", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {legs.map((leg, index) => (
                    <div key={leg.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {multiType === "samegame" ? `Selection ${index + 1}` : `Leg ${index + 1}`}
                        </h4>
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
                        {multiType === "normal" && (
                          <div className="space-y-2">
                            <Label htmlFor={`leg-${leg.id}-event`}>Event</Label>
                            <Input
                              id={`leg-${leg.id}-event`}
                              placeholder="e.g. Lakers vs Warriors"
                              value={leg.event}
                              onChange={(e) => updateLeg(leg.id, "event", e.target.value)}
                            />
                          </div>
                        )}
                        <div className={`space-y-2 ${multiType === "samegame" ? "md:col-span-2" : ""}`}>
                          <Label htmlFor={`leg-${leg.id}-selection`}>Selection</Label>
                          <Input
                            id={`leg-${leg.id}-selection`}
                            placeholder="e.g. Lakers to win"
                            value={leg.selection}
                            onChange={(e) => updateLeg(leg.id, "selection", e.target.value)}
                          />
                        </div>
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
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="combined-odds">Combined Odds</Label>
                {multiType === "samegame" ? (
                  <div className="space-y-2">
                    <Input
                      id="combined-odds"
                      type="number"
                      step="0.01"
                      placeholder="Enter combined odds"
                      value={manualCombinedOdds}
                      onChange={(e) => setManualCombinedOdds(e.target.value)}
                    />
                    {legs.some((leg) => leg.odds) && (
                      <div className="text-sm flex justify-between">
                        <span>Calculated odds:</span>
                        <span
                          className={`font-medium ${
                            manualCombinedOdds &&
                            Math.abs(Number(manualCombinedOdds) - Number(calculateCombinedOdds())) > 0.01
                              ? "text-amber-600"
                              : ""
                          }`}
                        >
                          {calculateCombinedOdds()}
                          {manualCombinedOdds &&
                            Math.abs(Number(manualCombinedOdds) - Number(calculateCombinedOdds())) > 0.01 &&
                            ` (${Number(manualCombinedOdds) > Number(calculateCombinedOdds()) ? "+" : ""}${(
                              (Number(manualCombinedOdds) / Number(calculateCombinedOdds())) * 100 - 100
                            ).toFixed(1)}%)`}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-10 px-3 rounded-md border bg-muted/50 text-sm flex items-center">
                        {calculateCombinedOdds()}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-10 whitespace-nowrap"
                        onClick={() => setManualCombinedOdds(calculateCombinedOdds())}
                      >
                        Adjust
                      </Button>
                    </div>
                    {manualCombinedOdds && (
                      <div className="flex items-center gap-2">
                        <Input
                          id="adjusted-odds"
                          type="number"
                          step="0.01"
                          placeholder="Adjusted odds"
                          value={manualCombinedOdds}
                          onChange={(e) => setManualCombinedOdds(e.target.value)}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-10"
                          onClick={() => setManualCombinedOdds("")}
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="multi-strategy">Betting Strategy</Label>
                <Select onValueChange={(value) => updateMultiBet("strategy", value)}>
                  <SelectTrigger id="multi-strategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Multi/Parlay">Standard Multi/Parlay</SelectItem>
                    <SelectItem value="Same Game Multi">Same Game Multi</SelectItem>
                    <SelectItem value="Multi Boost">Multi Boost</SelectItem>
                    <SelectItem value="Multi Insurance">Multi Insurance</SelectItem>
                  </SelectContent>
                </Select>
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
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="multi-promo-desc">Promotion Description</Label>
                      <Input
                        id="multi-promo-desc"
                        placeholder="e.g. Multi boost 25% extra odds"
                        value={multiBet.promoDesc || ""}
                        onChange={(e) => updateMultiBet("promoDesc", e.target.value)}
                      />
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
                    </div>
                  </>
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
                    <span className="font-medium">{manualCombinedOdds || calculateCombinedOdds()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Return:</span>
                    <span className="font-medium">
                      $
                      {multiBet.stake
                        ? (
                            Number(multiBet.stake) *
                            (manualCombinedOdds ? Number(manualCombinedOdds) : Number(calculateCombinedOdds()))
                          ).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Profit:</span>
                    <span className="font-medium text-green-600">
                      $
                      {multiBet.stake
                        ? (
                            Number(multiBet.stake) *
                              (manualCombinedOdds ? Number(manualCombinedOdds) : Number(calculateCombinedOdds())) -
                            Number(multiBet.stake)
                          ).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-type">System Type</Label>
                  <Select onValueChange={(value) => updateSystemBet("systemType", value)}>
                    <SelectTrigger id="system-type">
                      <SelectValue placeholder="Select system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trixie">Trixie (4 bets)</SelectItem>
                      <SelectItem value="patent">Patent (7 bets)</SelectItem>
                      <SelectItem value="yankee">Yankee (11 bets)</SelectItem>
                      <SelectItem value="lucky15">Lucky 15 (15 bets)</SelectItem>
                      <SelectItem value="canadian">Canadian (26 bets)</SelectItem>
                      <SelectItem value="lucky31">Lucky 31 (31 bets)</SelectItem>
                      <SelectItem value="heinz">Heinz (57 bets)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-stake">Unit Stake ($)</Label>
                  <Input
                    id="unit-stake"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5.00"
                    value={systemBet.unitStake}
                    onChange={(e) => updateSystemBet("unitStake", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-bookie">Bookmaker</Label>
                  <Select onValueChange={(value) => updateSystemBet("bookie", value)}>
                    <SelectTrigger id="system-bookie">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Selections</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSelection}>
                    Add Selection
                  </Button>
                </div>

                <div className="space-y-4">
                  {selections.map((selection, index) => (
                    <div key={selection.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Selection {index + 1}</h4>
                        {selections.length > 3 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSelection(selection.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`selection-${selection.id}-event`}>Event</Label>
                          <Input
                            id={`selection-${selection.id}-event`}
                            placeholder="e.g. Race 1 at Flemington"
                            value={selection.event}
                            onChange={(e) => updateSelection(selection.id, "event", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`selection-${selection.id}-selection`}>Selection</Label>
                          <Input
                            id={`selection-${selection.id}-selection`}
                            placeholder="e.g. Horse Name"
                            value={selection.selection}
                            onChange={(e) => updateSelection(selection.id, "selection", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`selection-${selection.id}-odds`}>Odds</Label>
                        <Input
                          id={`selection-${selection.id}-odds`}
                          type="number"
                          step="0.01"
                          placeholder="e.g. 3.50"
                          value={selection.odds}
                          onChange={(e) => updateSelection(selection.id, "odds", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-date">Date Placed</Label>
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

              <div className="border rounded-md p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">System Bet Summary</h3>
                  <div className="text-sm text-muted-foreground">
                    {systemBet.systemType
                      ? systemBet.systemType.charAt(0).toUpperCase() + systemBet.systemType.slice(1)
                      : "Select system type"}
                  </div>
                </div>

                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Number of Bets:</span>
                    <span className="font-medium">
                      {systemBet.systemType === "trixie"
                        ? 4
                        : systemBet.systemType === "patent"
                          ? 7
                          : systemBet.systemType === "yankee"
                            ? 11
                            : systemBet.systemType === "lucky15"
                              ? 15
                              : systemBet.systemType === "canadian"
                                ? 26
                                : systemBet.systemType === "lucky31"
                                  ? 31
                                  : systemBet.systemType === "heinz"
                                    ? 57
                                    : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Stake:</span>
                    <span className="font-medium">${systemBet.unitStake || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Stake:</span>
                    <span className="font-medium">
                      $
                      {systemBet.unitStake && systemBet.systemType
                        ? (
                            Number(systemBet.unitStake) *
                            (systemBet.systemType === "trixie"
                              ? 4
                              : systemBet.systemType === "patent"
                                ? 7
                                : systemBet.systemType === "yankee"
                                  ? 11
                                  : systemBet.systemType === "lucky15"
                                    ? 15
                                    : systemBet.systemType === "canadian"
                                      ? 26
                                      : systemBet.systemType === "lucky31"
                                        ? 31
                                        : systemBet.systemType === "heinz"
                                          ? 57
                                          : 0)
                          ).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="arbitrage">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arb-event">Event</Label>
                  <Input
                    id="arb-event"
                    placeholder="e.g. Man Utd vs Liverpool"
                    value={singleBet.event}
                    onChange={(e) => updateSingleBet("event", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arb-sport">Sport</Label>
                  <Select onValueChange={(value) => updateSingleBet("sport", value)}>
                    <SelectTrigger id="arb-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="MMA">MMA</SelectItem>
                      <SelectItem value="Boxing">Boxing</SelectItem>
                      <SelectItem value="Golf">Golf</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Horse Racing">Horse Racing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Arbitrage Bets</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLeg}>
                    Add Bet
                  </Button>
                </div>

                <div className="space-y-4">
                  {legs.map((leg, index) => (
                    <div key={leg.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Bet {index + 1}</h4>
                        {legs.length > 2 && (
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
                          <Label htmlFor={`arb-${leg.id}-selection`}>Selection</Label>
                          <Input
                            id={`arb-${leg.id}-selection`}
                            placeholder="e.g. Man Utd to win"
                            value={leg.selection}
                            onChange={(e) => updateLeg(leg.id, "selection", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`arb-${leg.id}-bookie`}>Bookmaker</Label>
                          <Input
                            id={`arb-${leg.id}-bookie`}
                            placeholder="e.g. Bet365"
                            value={leg.event}
                            onChange={(e) => updateLeg(leg.id, "event", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`arb-${leg.id}-odds`}>Odds</Label>
                          <Input
                            id={`arb-${leg.id}-odds`}
                            type="number"
                            step="0.01"
                            placeholder="e.g. 2.10"
                            value={leg.odds}
                            onChange={(e) => updateLeg(leg.id, "odds", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`arb-${leg.id}-stake`}>Stake ($)</Label>
                          <Input
                            id={`arb-${leg.id}-stake`}
                            type="number"
                            step="0.01"
                            placeholder="e.g. 100.00"
                            value={leg.stake || ""}
                            onChange={(e) => updateLeg(leg.id, "stake", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="arb-date">Date Placed</Label>
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

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium">Arbitrage Summary</h3>

                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Total Stake:</span>
                    <span className="font-medium">
                      ${legs.reduce((total, leg) => total + Number(leg.stake || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Implied Probability:</span>
                    <span className="font-medium">
                      {legs.some((leg) => !leg.odds)
                        ? "N/A"
                        : (legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0) * 100).toFixed(2) + "%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arbitrage Opportunity:</span>
                    <span
                      className={`font-medium ${
                        legs.some((leg) => !leg.odds)
                          ? ""
                          : legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0) < 1
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {legs.some((leg) => !leg.odds)
                        ? "N/A"
                        : legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0) < 1
                          ? "Yes"
                          : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Profit:</span>
                    <span className="font-medium text-green-600">
                      $
                      {legs.some((leg) => !leg.odds || !leg.stake)
                        ? "0.00"
                        : (
                            legs.reduce((total, leg) => total + Number(leg.stake || 0), 0) *
                            (1 - legs.reduce((total, leg) => total + 1 / Number(leg.odds || 1), 0))
                          ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dutching">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dutch-event">Event</Label>
                  <Input
                    id="dutch-event"
                    placeholder="e.g. Grand National"
                    value={singleBet.event}
                    onChange={(e) => updateSingleBet("event", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dutch-sport">Sport</Label>
                  <Select onValueChange={(value) => updateSingleBet("sport", value)}>
                    <SelectTrigger id="dutch-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Horse Racing">Horse Racing</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="MMA">MMA</SelectItem>
                      <SelectItem value="Boxing">Boxing</SelectItem>
                      <SelectItem value="Golf">Golf</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Dutch Bets</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSelection}>
                    Add Selection
                  </Button>
                </div>

                <div className="space-y-4">
                  {selections.map((selection, index) => (
                    <div key={selection.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Selection {index + 1}</h4>
                        {selections.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSelection(selection.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`dutch-${selection.id}-selection`}>Selection</Label>
                          <Input
                            id={`dutch-${selection.id}-selection`}
                            placeholder="e.g. Horse Name"
                            value={selection.selection}
                            onChange={(e) => updateSelection(selection.id, "selection", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dutch-${selection.id}-bookie`}>Bookmaker</Label>
                          <Input
                            id={`dutch-${selection.id}-bookie`}
                            placeholder="e.g. Bet365"
                            value={selection.event}
                            onChange={(e) => updateSelection(selection.id, "event", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`dutch-${selection.id}-odds`}>Odds</Label>
                          <Input
                            id={`dutch-${selection.id}-odds`}
                            type="number"
                            step="0.01"
                            placeholder="e.g. 5.00"
                            value={selection.odds}
                            onChange={(e) => updateSelection(selection.id, "odds", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dutch-${selection.id}-stake`}>Calculated Stake ($)</Label>
                          <Input
                            id={`dutch-${selection.id}-stake`}
                            type="number"
                            step="0.01"
                            placeholder="Calculated"
                            value={selection.stake || ""}
                            onChange={(e) => updateSelection(selection.id, "stake", e.target.value)}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dutch-total-stake">Total Stake ($)</Label>
                  <Input
                    id="dutch-total-stake"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 100.00"
                    value={singleBet.stake}
                    onChange={(e) => updateSingleBet("stake", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dutch-target-profit">Target Profit ($)</Label>
                  <Input
                    id="dutch-target-profit"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 50.00"
                    value={singleBet.targetProfit || ""}
                    onChange={(e) => updateSingleBet("targetProfit", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dutch-date">Date Placed</Label>
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
                    id="dutch-is-promo"
                    checked={isPromo}
                    onCheckedChange={(checked) => setIsPromo(checked === true)}
                  />
                  <Label htmlFor="dutch-is-promo" className="text-sm font-medium">
                    Promotional Offer
                  </Label>
                </div>

                {isPromo && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dutch-promo-desc">Promotion Description</Label>
                      <Input
                        id="dutch-promo-desc"
                        placeholder="e.g. Money back if second"
                        value={singleBet.promoDesc || ""}
                        onChange={(e) => updateSingleBet("promoDesc", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dutch-max-stake">Maximum Stake ($)</Label>
                      <Input
                        id="dutch-max-stake"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 50.00"
                        value={singleBet.maxStake || ""}
                        onChange={(e) => updateSingleBet("maxStake", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium">Dutching Summary</h3>

                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Total Stake:</span>
                    <span className="font-medium">${singleBet.stake || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Implied Probability:</span>
                    <span className="font-medium">
                      {selections.some((sel) => !sel.odds)
                        ? "N/A"
                        : (selections.reduce((total, sel) => total + 1 / Number(sel.odds || 1), 0) * 100).toFixed(2) +
                          "%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Return:</span>
                    <span className="font-medium">
                      {selections.some((sel) => !sel.odds) || !singleBet.stake
                        ? "N/A"
                        : "$" +
                          (
                            Number(singleBet.stake) /
                            selections.reduce((total, sel) => total + 1 / Number(sel.odds || 1), 0)
                          ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Profit:</span>
                    <span className="font-medium text-green-600">
                      {selections.some((sel) => !sel.odds) || !singleBet.stake
                        ? "$0.00"
                        : "$" +
                          (
                            Number(singleBet.stake) /
                              selections.reduce((total, sel) => total + 1 / Number(sel.odds || 1), 0) -
                            Number(singleBet.stake)
                          ).toFixed(2)}
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
                  <Label htmlFor="backlay-event">Event</Label>
                  <Input
                    id="backlay-event"
                    placeholder="e.g. Man Utd vs Liverpool"
                    value={backLayBet.event}
                    onChange={(e) => updateBackLayBet("event", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bl-sport">Sport</Label>
                  <Select onValueChange={(value) => updateBackLayBet("sport", value)}>
                    <SelectTrigger id="bl-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="MMA">MMA</SelectItem>
                      <SelectItem value="Boxing">Boxing</SelectItem>
                      <SelectItem value="Golf">Golf</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Horse Racing">Horse Racing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backlay-selection">Selection</Label>
                <Input
                  id="backlay-selection"
                  placeholder="e.g. Man Utd to win"
                  value={backLayBet.selection}
                  onChange={(e) => updateBackLayBet("selection", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Back Bet</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="back-bookie">Bookmaker</Label>
                      <Select onValueChange={(value) => updateBackLayBet("backBookie", value)}>
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
                      <div className="mt-2 p-2 border rounded-md bg-purple-50 dark:bg-purple-900/20">
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
                            onClick={() => handleUseBonusBet(backLayBet.backBookie)}
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
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Lay Bet</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="lay-exchange">Exchange</Label>
                      <Select onValueChange={(value) => updateBackLayBet("layExchange", value)}>
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
                </div>
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bl-date">Date Placed</Label>
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
                  <Label htmlFor="bl-tipper">Tipper/Source</Label>
                  <Select onValueChange={(value) => updateBackLayBet("tipper", value)}>
                    <SelectTrigger id="bl-tipper">
                      <SelectValue placeholder="Select tipper" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self">Self</SelectItem>
                      <SelectItem value="SportsTips Pro">SportsTips Pro</SelectItem>
                      <SelectItem value="Tennis Insider">Tennis Insider</SelectItem>
                      <SelectItem value="MLB Expert">MLB Expert</SelectItem>
                      <SelectItem value="UFC Predictions">UFC Predictions</SelectItem>
                      <SelectItem value="Premier League Tips">Premier League Tips</SelectItem>
                      <SelectItem value="Dutching">Dutching</SelectItem>
                      <SelectItem value="Arbitrage">Arbitrage</SelectItem>
                      <SelectItem value="Bonus Bet">Bonus Bet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bl-notes">Notes</Label>
                  <Input
                    id="bl-notes"
                    placeholder="Any additional notes about this back & lay bet"
                    value={backLayBet.notes}
                    onChange={(e) => updateBackLayBet("notes", e.target.value)}
                  />
                </div>
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
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="backlay-promo-desc">Promotion Description</Label>
                      <Input
                        id="backlay-promo-desc"
                        placeholder="e.g. Early payout if team leads by 2 goals"
                        value={backLayBet.promoDesc || ""}
                        onChange={(e) => updateBackLayBet("promoDesc", e.target.value)}
                      />
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
                    </div>
                  </>
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
