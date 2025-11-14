"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  Search,
  Grid3X3,
  List,
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  User,
  DollarSign,
  BookOpen,
  Laptop,
  Beaker,
} from "lucide-react"

const marketplaceItems = [
  {
    id: 1,
    title: "Advanced Engineering Mathematics Textbook",
    description:
      "Kreyszig's Advanced Engineering Mathematics, 10th Edition. Excellent condition, minimal highlighting.",
    price: 45,
    originalPrice: 89,
    category: "Books",
    condition: "Like New",
    seller: "Sarah Chen",
    location: "Campus North",
    timeAgo: "2 hours ago",
    images: ["/engineering-mathematics-textbook.png"],
    likes: 12,
    comments: 3,
    tags: ["mathematics", "engineering", "textbook", "kreyszig"],
  },
  {
    id: 2,
    title: "Scientific Calculator TI-84 Plus",
    description: "Texas Instruments TI-84 Plus graphing calculator. Perfect for calculus and statistics courses.",
    price: 65,
    originalPrice: 120,
    category: "Electronics",
    condition: "Good",
    seller: "Mike Johnson",
    location: "Campus South",
    timeAgo: "5 hours ago",
    images: ["/placeholder-wpsau.png"],
    likes: 8,
    comments: 5,
    tags: ["calculator", "TI-84", "graphing", "mathematics"],
  },
  {
    id: 3,
    title: "Organic Chemistry Lab Kit",
    description: "Complete organic chemistry lab kit with glassware, reagents, and safety equipment. Never used.",
    price: 120,
    originalPrice: 200,
    category: "Lab Equipment",
    condition: "New",
    seller: "Emma Davis",
    location: "Chemistry Building",
    timeAgo: "1 day ago",
    images: ["/placeholder-w20hr.png"],
    likes: 15,
    comments: 7,
    tags: ["chemistry", "lab", "organic", "glassware"],
  },
  {
    id: 4,
    title: 'MacBook Pro 13" (2021)',
    description: "MacBook Pro with M1 chip, 8GB RAM, 256GB SSD. Great for programming and design work.",
    price: 850,
    originalPrice: 1299,
    category: "Electronics",
    condition: "Excellent",
    seller: "Alex Kumar",
    location: "Computer Science Dept",
    timeAgo: "2 days ago",
    images: ["/macbook-pro.png"],
    likes: 23,
    comments: 12,
    tags: ["laptop", "macbook", "programming", "M1"],
  },
  {
    id: 5,
    title: "Physics Textbook Bundle",
    description: "Halliday, Resnick & Krane Physics bundle - all 3 volumes. Some wear but all pages intact.",
    price: 80,
    originalPrice: 150,
    category: "Books",
    condition: "Good",
    seller: "Lisa Wang",
    location: "Physics Department",
    timeAgo: "3 days ago",
    images: ["/placeholder-hm2df.png"],
    likes: 6,
    comments: 2,
    tags: ["physics", "textbook", "halliday", "bundle"],
  },
  {
    id: 6,
    title: "Digital Multimeter",
    description: "Fluke 117 digital multimeter. Essential for electrical engineering labs and projects.",
    price: 95,
    originalPrice: 160,
    category: "Lab Equipment",
    condition: "Like New",
    seller: "Tom Rodriguez",
    location: "Engineering Block",
    timeAgo: "1 week ago",
    images: ["/placeholder-dtyg4.png"],
    likes: 4,
    comments: 1,
    tags: ["multimeter", "electrical", "engineering", "fluke"],
  },
]

const categories = ["All Categories", "Books", "Electronics", "Lab Equipment", "Stationery", "Other"]
const conditions = ["All Conditions", "New", "Like New", "Excellent", "Good", "Fair"]
const priceRanges = ["All Prices", "Under $25", "$25-$50", "$50-$100", "$100-$200", "Over $200"]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Books":
      return BookOpen
    case "Electronics":
      return Laptop
    case "Lab Equipment":
      return Beaker
    default:
      return DollarSign
  }
}

export default function MarketplacePage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedCondition, setSelectedCondition] = useState("All Conditions")
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices")

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory
    const matchesCondition = selectedCondition === "All Conditions" || item.condition === selectedCondition

    let matchesPrice = true
    if (selectedPriceRange !== "All Prices") {
      switch (selectedPriceRange) {
        case "Under $25":
          matchesPrice = item.price < 25
          break
        case "$25-$50":
          matchesPrice = item.price >= 25 && item.price <= 50
          break
        case "$50-$100":
          matchesPrice = item.price >= 50 && item.price <= 100
          break
        case "$100-$200":
          matchesPrice = item.price >= 100 && item.price <= 200
          break
        case "Over $200":
          matchesPrice = item.price > 200
          break
      }
    }

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />

      <div className={cn("flex-1 transition-all duration-300", isCollapsed ? "lg:ml-16" : "lg:ml-64")}>
        <Header />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Buy and sell textbooks, calculators, and study materials with fellow students
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items, descriptions, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {marketplaceItems.length} items
            </p>
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Sell Item
            </Button>
          </div>

          {/* Items Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category)
                return (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">{item.condition}</Badge>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-600 hover:bg-green-700">${item.price}</Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4 text-primary" />
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                          )}
                        </div>

                        <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {item.seller}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {item.location}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {item.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {item.comments}
                            </div>
                          </div>
                          <Button size="sm">Contact Seller</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category)
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <Badge variant="secondary">{item.condition}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-green-600">${item.price}</span>
                              {item.originalPrice > item.price && (
                                <span className="text-lg text-muted-foreground line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3">{item.description}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <CategoryIcon className="h-4 w-4 text-primary" />
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            {item.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {item.seller}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {item.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {item.timeAgo}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {item.likes}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {item.comments}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button size="sm">Contact Seller</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
