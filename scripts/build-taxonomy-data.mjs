import fs from 'fs';
import path from 'path';

// 140 candidate products defined in Part 7
const rawCandidates = [
  // 7.1 Pretreatment (1-20)
  { num: 1, name: "Textile Wetting Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Wetting", fibres: ["Cotton", "Viscose", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric", "Yarn Processing"], approved: true },
  { num: 2, name: "Textile Penetrating Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Wetting", fibres: ["Cotton", "Cellulosics", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric"], approved: false },
  { num: 3, name: "Textile Scouring Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Scouring", fibres: ["Cotton", "Viscose", "Wool", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric", "Yarn Processing"], approved: true },
  { num: 4, name: "Textile Detergent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Scouring", fibres: ["Cotton", "Polyester", "Nylon", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric"], approved: false },
  { num: 5, name: "Textile Desizing Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Desizing", fibres: ["Cotton", "Viscose", "Blended Fibres"], apps: ["Woven Fabric", "Denim"], approved: true },
  { num: 6, name: "Amylase Desizing Enzyme", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Desizing", fibres: ["Cotton", "Viscose", "Blended Fibres"], apps: ["Woven Fabric", "Denim"], approved: false },
  { num: 7, name: "Degreasing Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Scouring", fibres: ["Cotton", "Synthetics", "Blended Fibres"], apps: ["Knitted Fabric", "Woven Fabric"], approved: false },
  { num: 8, name: "Pectinase Enzyme", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Scouring", fibres: ["Cotton", "Linen"], apps: ["Knitted Fabric", "Yarn Processing"], approved: false },
  { num: 9, name: "Textile Sequestering Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Sequestering", fibres: ["Cotton", "Viscose", "Polyester", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric", "Yarn Processing"], approved: true },
  { num: 10, name: "Textile Chelating Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Sequestering", fibres: ["Cotton", "Viscose", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric"], approved: false },
  { num: 11, name: "Peroxide Stabiliser", cat: "Bleaching Chemicals", stage: "Bleaching", func: "Stabilising", fibres: ["Cotton", "Cellulosics", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric", "Yarn Processing"], approved: true },
  { num: 12, name: "Textile Bleaching Auxiliary", cat: "Bleaching Chemicals", stage: "Bleaching", func: "Stabilising", fibres: ["Cotton", "Viscose", "Blended Fibres"], apps: ["Woven Fabric", "Knitted Fabric"], approved: false },
  { num: 13, name: "Peroxide Killer", cat: "Bleaching Chemicals", stage: "Bleaching", func: "Bleaching Neutralisation", fibres: ["Cotton", "Cellulosics", "Blended Fibres"], apps: ["Knitted Fabric", "Yarn Processing"], approved: true },
  { num: 14, name: "Catalase Enzyme", cat: "Bleaching Chemicals", stage: "Bleaching", func: "Bleaching Neutralisation", fibres: ["Cotton", "Cellulosics"], apps: ["Knitted Fabric", "Yarn Processing"], approved: false },
  { num: 15, name: "Alkali Neutraliser", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Neutralising", fibres: ["Cotton", "Viscose"], apps: ["Woven Fabric", "Knitted Fabric"], approved: false },
  { num: 16, name: "Acid Neutraliser", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Neutralising", fibres: ["Wool", "Synthetics"], apps: ["Yarn Processing", "Woven Fabric"], approved: false },
  { num: 17, name: "Mercerising Auxiliary", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Wetting", fibres: ["Cotton"], apps: ["Woven Fabric", "Yarn Processing"], approved: false },
  { num: 18, name: "Anti-Creasing Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Lubricating", fibres: ["Cotton", "Viscose", "Polyester", "Nylon"], apps: ["Knitted Fabric", "Woven Fabric"], approved: false },
  { num: 19, name: "Anti-Rope-Mark Agent", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Lubricating", fibres: ["Cotton", "Polyester", "Blended Fibres"], apps: ["Soft-Flow Knits", "Woven Fabric"], approved: false },
  { num: 20, name: "Textile Defoamer", cat: "Pretreatment Chemicals", stage: "Pretreatment", func: "Defoaming", fibres: ["Cotton", "Polyester", "Blended Fibres"], apps: ["Jet Dyeing", "Continuous Ranges"], approved: false },

  // 7.2 Dyeing Auxiliaries (21-36)
  { num: 21, name: "Textile Levelling Agent", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Levelling", fibres: ["Cotton", "Polyester", "Nylon", "Acrylic", "Blended Fibres"], apps: ["Knitted Fabric", "Woven Fabric", "Yarn Processing"], approved: true },
  { num: 22, name: "Textile Dispersing Agent", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Dispersing", fibres: ["Polyester", "Acetate", "Blended Fibres"], apps: ["HT Dyeing", "Thermosol Ranges"], approved: false },
  { num: 23, name: "Dyeing Wetting Agent", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Wetting", fibres: ["Cotton", "Viscose", "Blended Fibres"], apps: ["Exhaust Dyeing", "Continuous Dyeing"], approved: false },
  { num: 24, name: "Acid Buffer", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "pH Regulation", fibres: ["Polyester", "Nylon", "Wool"], apps: ["Disperse Dyeing", "Acid Dyeing"], approved: false },
  { num: 25, name: "Alkali Buffer", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "pH Regulation", fibres: ["Cotton", "Viscose"], apps: ["Reactive Dyeing"], approved: false },
  { num: 26, name: "Acid Donor", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "pH Regulation", fibres: ["Nylon", "Wool"], apps: ["Exhaust Dyeing"], approved: false },
  { num: 27, name: "Alkali Donor", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "pH Regulation", fibres: ["Cotton", "Viscose"], apps: ["Reactive Continuous Dyeing"], approved: false },
  { num: 28, name: "Dye Carrier", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Carrier Dyeing", fibres: ["Polyester", "Triacetate", "Blended Fibres"], apps: ["Atmospheric Winch Dyeing"], approved: false },
  { num: 29, name: "Dye Fixing Agent", cat: "After-treatment & Washing", stage: "After-treatment", func: "Fixing", fibres: ["Cotton", "Viscose", "Cellulosics"], apps: ["Knitted Fabric", "Woven Fabric", "Garments"], approved: true },
  { num: 30, name: "Anti-Migration Agent", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Anti-Migration", fibres: ["Cotton", "Polyester", "Blended Fibres"], apps: ["Pad-Dry-Thermosol", "Continuous Ranges"], approved: false },
  { num: 31, name: "Dyeing Lubricant", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Lubricating", fibres: ["Cotton", "Polyester", "Nylon", "Blended Fibres"], apps: ["Jet Dyeing", "Overflow Winches"], approved: false },
  { num: 32, name: "Deaerator", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Deaeration", fibres: ["Cotton", "Polyester", "Yarn Packages"], apps: ["Package Yarn Dyeing", "Beam Dyeing"], approved: false },
  { num: 33, name: "Dyeing Defoamer", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Defoaming", fibres: ["Cotton", "Polyester", "Blended Fibres"], apps: ["Jet Machines", "Overflow Winches"], approved: false },
  { num: 34, name: "Reduction Clearing Agent", cat: "After-treatment & Washing", stage: "After-treatment", func: "Washing-off", fibres: ["Polyester", "Polyester Blends"], apps: ["Post-Disperse Wash", "Continuous Ranges"], approved: false },
  { num: 35, name: "Polyester Oligomer Remover", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Dispersing", fibres: ["Polyester"], apps: ["HT Dyeing", "Yarn Package Dyeing"], approved: false },
  { num: 36, name: "Dyeing Process Regulator", cat: "Dyeing Auxiliaries", stage: "Dyeing", func: "Levelling", fibres: ["Cotton", "Polyester", "Blended Fibres"], apps: ["Rapid Dyeing Cycles"], approved: false },

  // 7.3 Dyes and Colourants (37-44) - Distinct coloration family
  { num: 37, name: "Reactive Dyes", cat: "Textile Dyes and Colourants", stage: "Dyeing", func: "Coloration", fibres: ["Cotton", "Viscose", "Cellulosics"], apps: ["Exhaust Dyeing", "Continuous Dyeing", "Printing"], approved: false },
  { num: 38, name: "Disperse Dyes", cat: "Textile Dyes and Colourants", stage: "Dyeing", func: "Coloration", fibres: ["Polyester", "Acetate", "Nylon"], apps: ["HT Dyeing", "Thermosol", "Sublimation"], approved: false },
  { num: 39, name: "Direct Dyes", cat: "Textile Dyes and Colourants", stage: "Dyeing", func: "Coloration", fibres: ["Cotton", "Viscose", "Jute"], apps: ["Atmospheric Dyeing", "Paper/Textile"], approved: false },
  { num: 40, name: "Acid Dyes", cat: "Textile Dyes and Colourants", stage: "Dyeing", func: "Coloration", fibres: ["Nylon", "Wool", "Silk"], apps: ["Apparel Dyeing", "Swimwear"], approved: false },
  { num: 41, name: "Basic Dyes", cat: "Textile Dyes and Colourants", stage: "Dyeing", func: "Coloration", fibres: ["Acrylic", "Cationic Dyeable Polyester"], apps: ["Knitwear", "Blankets"], approved: false },
  { num: 42, name: "Vat Dyes", cat: "Textile Dyes and Colourants", stage: "Dyeing", func: "Coloration", fibres: ["Cotton", "Linen"], apps: ["Workwear", "Hospitality Uniforms", "Yarn"], approved: false },
  { num: 43, name: "Sulphur Dyes", cat: "Textile Dyes and Colourants", stage: "Dyeing", func: "Coloration", fibres: ["Cotton", "Cellulosics"], apps: ["Denim Warp", "Heavy Canvas"], approved: false },
  { num: 44, name: "Pigment Colourants", cat: "Textile Dyes and Colourants", stage: "Printing", func: "Coloration", fibres: ["All Fibre Types", "Blended Fibres"], apps: ["Pigment Printing", "Exhaust Garment Tinting"], approved: false },

  // 7.4 Printing (45-59)
  { num: 45, name: "Textile Printing Thickener", cat: "Printing Chemicals", stage: "Printing", func: "Thickening", fibres: ["Cotton", "Viscose", "Polyester", "Blended Fibres"], apps: ["Rotary Screen Printing", "Flatbed Printing", "Table Printing"], approved: true },
  { num: 46, name: "Sodium Alginate Thickener", cat: "Printing Chemicals", stage: "Printing", func: "Thickening", fibres: ["Cotton", "Viscose"], apps: ["Reactive Dye Printing"], approved: false },
  { num: 47, name: "Guar Gum Thickener", cat: "Printing Chemicals", stage: "Printing", func: "Thickening", fibres: ["Nylon", "Wool", "Polyester"], apps: ["Acid & Disperse Printing"], approved: false },
  { num: 48, name: "CMC Thickener", cat: "Printing Chemicals", stage: "Printing", func: "Thickening", fibres: ["Cellulosics", "Blended Fibres"], apps: ["Printing Pastes"], approved: false },
  { num: 49, name: "Synthetic Printing Thickener", cat: "Printing Chemicals", stage: "Printing", func: "Thickening", fibres: ["Cotton", "Polyester", "Blends"], apps: ["Pigment Printing"], approved: false },
  { num: 50, name: "Pigment Printing Binder", cat: "Printing Chemicals", stage: "Printing", func: "Binding", fibres: ["Cotton", "Polyester", "Blended Fibres"], apps: ["Home Textiles", "Apparel Printing"], approved: false },
  { num: 51, name: "Acrylic Textile Binder", cat: "Printing Chemicals", stage: "Printing", func: "Binding", fibres: ["Cotton", "Blended Fibres"], apps: ["Pigment Screen Printing"], approved: false },
  { num: 52, name: "PU Printing Binder", cat: "Printing Chemicals", stage: "Printing", func: "Binding", fibres: ["Knitted Fabric", "Elastic Textiles"], apps: ["Soft Elastic Prints"], approved: false },
  { num: 53, name: "Textile Crosslinker", cat: "Printing Chemicals", stage: "Printing", func: "Crosslinking", fibres: ["Cotton", "Blended Fibres"], apps: ["Pigment Print Fixation"], approved: false },
  { num: 54, name: "Printing Catalyst", cat: "Printing Chemicals", stage: "Printing", func: "Crosslinking", fibres: ["Cotton", "Cellulosics"], apps: ["Pigment Print Curing"], approved: false },
  { num: 55, name: "Printing Emulsifier", cat: "Printing Chemicals", stage: "Printing", func: "Emulsifying", fibres: ["Blended Fibres"], apps: ["Emulsion Print Systems"], approved: false },
  { num: 56, name: "Printing Humectant", cat: "Printing Chemicals", stage: "Printing", func: "Humectant", fibres: ["Cotton", "Polyester"], apps: ["Screen Choke Prevention"], approved: false },
  { num: 57, name: "Printing Defoamer", cat: "Printing Chemicals", stage: "Printing", func: "Defoaming", fibres: ["All Fibres"], apps: ["High-Speed Rotary Pastes"], approved: false },
  { num: 58, name: "Anti-Migration Agent", cat: "Printing Chemicals", stage: "Printing", func: "Anti-Migration", fibres: ["Cotton", "Blended Fibres"], apps: ["Pad-Print Sequences"], approved: false },
  { num: 59, name: "Specialty Printing Modifier", cat: "Printing Chemicals", stage: "Printing", func: "Special Effects", fibres: ["Cotton", "Denim", "Knits"], apps: ["Discharge & Resist Prints"], approved: false },

  // 7.5 After-treatment (60-67)
  { num: 60, name: "Textile Soaping Agent", cat: "After-treatment & Washing", stage: "After-treatment", func: "Washing-off", fibres: ["Cotton", "Viscose", "Cellulosics"], apps: ["Post-Reactive Wash", "Continuous Wash Ranges"], approved: true },
  { num: 61, name: "Washing-Off Agent", cat: "After-treatment & Washing", stage: "After-treatment", func: "Washing-off", fibres: ["Cotton", "Cellulosics"], apps: ["Exhaust Soaping", "Woven Wash Ranges"], approved: false },
  { num: 62, name: "Post-Dyeing Detergent", cat: "After-treatment & Washing", stage: "After-treatment", func: "Washing-off", fibres: ["Cotton", "Polyester", "Nylon"], apps: ["Piece Dye Washing"], approved: false },
  { num: 63, name: "Anti-Back-Staining Agent", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Anti-back-staining", fibres: ["Cotton", "Denim"], apps: ["Denim Enzyme Wash", "Garment Laundry"], approved: false },
  { num: 64, name: "Textile Stain Remover", cat: "After-treatment & Washing", stage: "After-treatment", func: "Spotting", fibres: ["Cotton", "Polyester", "Blends"], apps: ["Inspection & Mending"], approved: false },
  { num: 65, name: "Colour Stripping Agent", cat: "After-treatment & Washing", stage: "After-treatment", func: "Stripping", fibres: ["Cotton", "Polyester", "Nylon"], apps: ["Rework & Shade Correction"], approved: false },
  { num: 66, name: "Textile Machine Cleaning Agent", cat: "After-treatment & Washing", stage: "After-treatment", func: "Cleaning", fibres: ["Process Machinery"], apps: ["Jet Cleaning", "Stenter Cleaners"], approved: false },
  { num: 67, name: "Rubbing Fastness Improver", cat: "After-treatment & Washing", stage: "After-treatment", func: "Fastness Improvement", fibres: ["Cotton", "Cellulosics", "Denim"], apps: ["Deep Shade Finishing", "Pigment Prints"], approved: false },

  // 7.6 Optical Brighteners (68-73)
  { num: 68, name: "Cotton Optical Brightener", cat: "Optical Brighteners", stage: "Bleaching", func: "Brightening", fibres: ["Cotton", "Cellulosics"], apps: ["Knit Finishing", "Yarn Bleaching"], approved: true },
  { num: 69, name: "Polyester Optical Brightener", cat: "Optical Brighteners", stage: "Dyeing", func: "Brightening", fibres: ["Polyester", "Synthetic Blends"], apps: ["Thermosol", "HT Exhaust"], approved: false },
  { num: 70, name: "Nylon Optical Brightener", cat: "Optical Brighteners", stage: "Dyeing", func: "Brightening", fibres: ["Nylon / Polyamide"], apps: ["Lingerie & Activewear"], approved: false },
  { num: 71, name: "Acrylic Optical Brightener", cat: "Optical Brighteners", stage: "Dyeing", func: "Brightening", fibres: ["Acrylic"], apps: ["Knitwear & Blankets"], approved: false },
  { num: 72, name: "Wool Optical Brightener", cat: "Optical Brighteners", stage: "Finishing", func: "Brightening", fibres: ["Wool", "Silk"], apps: ["Wool Finishing"], approved: false },
  { num: 73, name: "Cellulosic Optical Brightener", cat: "Optical Brighteners", stage: "Bleaching", func: "Brightening", fibres: ["Viscose", "Modal", "Lyocell"], apps: ["Continuous Padding", "Exhaust"], approved: false },

  // 7.7 Softeners and Finishing (74-91)
  { num: 74, name: "Cationic Textile Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Cotton", "Polyester", "Acrylic", "Blended Fibres"], apps: ["Knitted Fabric", "Woven Fabric", "Towel Finishing"], approved: true },
  { num: 75, name: "Nonionic Textile Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Cotton", "Polyester", "Blended Fibres"], apps: ["Resin Finishing", "Pure White Fabrics"], approved: false },
  { num: 76, name: "Anionic Textile Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Cotton", "Cellulosics"], apps: ["Specialty Finishes"], approved: false },
  { num: 77, name: "Amphoteric Textile Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Cotton", "Wool", "Blends"], apps: ["Sensitive Touch Fabrics"], approved: false },
  { num: 78, name: "Silicone Textile Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Cotton", "Polyester", "Viscose", "Blended Fibres"], apps: ["Apparel Knits", "Shirting", "Denim"], approved: true },
  { num: 79, name: "Amino Silicone Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Cotton", "Polyester", "Knits"], apps: ["Ultra-Soft Apparel"], approved: false },
  { num: 80, name: "Micro Silicone Emulsion", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Fine Knits", "Microfibre"], apps: ["Deep Penetration Softening"], approved: false },
  { num: 81, name: "Macro Silicone Emulsion", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Denim", "Heavy Twills"], apps: ["Surface Hand Modification"], approved: false },
  { num: 82, name: "Hydrophilic Silicone Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Cotton", "Viscose", "Towels"], apps: ["Absorbent Towels", "Activewear"], approved: false },
  { num: 83, name: "Hydrophobic Silicone Softener", cat: "Softeners & Finishing", stage: "Finishing", func: "Softening", fibres: ["Outerwear", "Polyester"], apps: ["Water Shedding Feel"], approved: false },
  { num: 84, name: "Polyethylene Emulsion", cat: "Softeners & Finishing", stage: "Finishing", func: "Lubricating", fibres: ["Cotton", "Blended Fibres"], apps: ["Sewability Improvement", "Tear Strength"], approved: false },
  { num: 85, name: "Textile Wax Emulsion", cat: "Softeners & Finishing", stage: "Finishing", func: "Lubricating", fibres: ["Cotton", "Wool", "Yarns"], apps: ["Yarn Waxing", "Sewing Threads"], approved: false },
  { num: 86, name: "Easy-Care Resin", cat: "Softeners & Finishing", stage: "Finishing", func: "Easy-Care", fibres: ["Cotton", "Viscose", "Linen"], apps: ["Anti-Crease Shirting", "Form Retention"], approved: false },
  { num: 87, name: "Textile Crosslinker", cat: "Softeners & Finishing", stage: "Finishing", func: "Crosslinking", fibres: ["Cellulosics"], apps: ["DMDHEU Resin Baths"], approved: false },
  { num: 88, name: "Resin Catalyst", cat: "Softeners & Finishing", stage: "Finishing", func: "Catalysis", fibres: ["Cellulosics"], apps: ["Stenter Curing Activation"], approved: false },
  { num: 89, name: "Anti-Pilling Agent", cat: "Softeners & Finishing", stage: "Finishing", func: "Pilling Prevention", fibres: ["Polyester", "Cotton Blends", "Wool"], apps: ["Knitted Sweaters", "Fleece"], approved: false },
  { num: 90, name: "Anti-Snag Agent", cat: "Softeners & Finishing", stage: "Finishing", func: "Snag Prevention", fibres: ["Filament Synthetics"], apps: ["Sportswear Knits"], approved: false },
  { num: 91, name: "Soil-Release Finish", cat: "Functional Finishes", stage: "Finishing", func: "Soil Release", fibres: ["Cotton", "Polyester", "Workwear"], apps: ["Industrial Uniforms", "Tablecloths"], approved: false },

  // 7.8 Functional Finishes (92-107)
  { num: 92, name: "Textile Water Repellent", cat: "Functional Finishes", stage: "Finishing", func: "Water Repellency", fibres: ["Polyester", "Nylon", "Cotton", "Blends"], apps: ["Outerwear", "Rainwear", "Umbrellas"], approved: true },
  { num: 93, name: "Textile Oil Repellent", cat: "Functional Finishes", stage: "Finishing", func: "Oil Repellency", fibres: ["Workwear", "Synthetics"], apps: ["Protective Uniforms"], approved: false },
  { num: 94, name: "PFAS-Free Water Repellent System", cat: "Functional Finishes", stage: "Finishing", func: "Water Repellency", fibres: ["Polyester", "Polyamide", "Cotton"], apps: ["Eco-Compliant Sportswear", "Jackets"], approved: false },
  { num: 95, name: "Textile Antistatic Agent", cat: "Functional Finishes", stage: "Finishing", func: "Antistatic", fibres: ["Polyester", "Nylon", "Acrylic"], apps: ["Cleanroom Apparel", "Linings"], approved: false },
  { num: 96, name: "Hydrophilic Finish", cat: "Functional Finishes", stage: "Finishing", func: "Moisture Management", fibres: ["Polyester", "Synthetic Blends"], apps: ["Athletic Wear", "Undergarments"], approved: false },
  { num: 97, name: "Moisture-Management Finish", cat: "Functional Finishes", stage: "Finishing", func: "Wicking", fibres: ["Polyester", "Nylon", "Knits"], apps: ["Performance Sportswear"], approved: false },
  { num: 98, name: "Wicking Finish", cat: "Functional Finishes", stage: "Finishing", func: "Wicking", fibres: ["Synthetic Knits"], apps: ["Gym Wear", "Running Apparel"], approved: false },
  { num: 99, name: "Antimicrobial Textile Finish", cat: "Functional Finishes", stage: "Finishing", func: "Antimicrobial", fibres: ["Cotton", "Synthetics", "Blends"], apps: ["Hospital Linens", "Socks", "Underwear"], approved: false },
  { num: 100, name: "Anti-Odour Finish", cat: "Functional Finishes", stage: "Finishing", func: "Odour Control", fibres: ["Synthetics", "Cotton"], apps: ["Sportswear", "Workwear"], approved: false },
  { num: 101, name: "UV-Protective Finish", cat: "Functional Finishes", stage: "Finishing", func: "UV Protection", fibres: ["Cotton", "Polyester"], apps: ["Sun-Protective Clothing", "Canopies"], approved: false },
  { num: 102, name: "Flame-Retardant Finish", cat: "Functional Finishes", stage: "Finishing", func: "Flame Retardancy", fibres: ["Cotton", "Polyester", "Cellulosics"], apps: ["Curtains", "Contract Upholstery", "Workwear"], approved: false },
  { num: 103, name: "Wrinkle-Resistant Finish", cat: "Functional Finishes", stage: "Finishing", func: "Crease Resistance", fibres: ["Cotton", "Linen"], apps: ["Formal Shirting", "Trousers"], approved: false },
  { num: 104, name: "Anti-Yellowing Agent", cat: "Functional Finishes", stage: "Finishing", func: "Yellowing Prevention", fibres: ["Polyamide", "Elastane Blends"], apps: ["White Swimwear", "Moulded Bras"], approved: false },
  { num: 105, name: "Phenolic Yellowing Preventer", cat: "Functional Finishes", stage: "Finishing", func: "Yellowing Prevention", fibres: ["Nylon", "Elastane", "Fine Whites"], apps: ["Export Packaging Storage Protection"], approved: false },
  { num: 106, name: "Stain-Repellent Finish", cat: "Functional Finishes", stage: "Finishing", func: "Stain Resistance", fibres: ["Cotton Blends", "Polyester"], apps: ["School Uniforms", "Casual Slacks"], approved: false },
  { num: 107, name: "Abrasion-Resistant Finish", cat: "Functional Finishes", stage: "Finishing", func: "Abrasion Resistance", fibres: ["Cotton", "Synthetic Blends"], apps: ["Heavy Workwear", "Backpack Fabric"], approved: false },

  // 7.9 Garment and Denim (108-118)
  { num: 108, name: "Neutral Cellulase Enzyme", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Enzymatic Abrasion", fibres: ["Cotton Denim"], apps: ["Denim Laundry", "Vintage Fading"], approved: true },
  { num: 109, name: "Acid Cellulase Enzyme", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Bio-Polishing", fibres: ["Cotton Knits", "T-Shirts"], apps: ["Hairiness Elimination", "Soft Wash"], approved: false },
  { num: 110, name: "Bio-Polishing Enzyme", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Bio-Polishing", fibres: ["Cotton", "Viscose", "Modal"], apps: ["Pill-Resistant Knits"], approved: false },
  { num: 111, name: "Garment Washing Detergent", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Scouring", fibres: ["Denim", "Garments"], apps: ["Industrial Laundry Wash"], approved: false },
  { num: 112, name: "Denim Washing Auxiliary", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Special Effects", fibres: ["Denim"], apps: ["Stone-Free Washing"], approved: false },
  { num: 113, name: "Indigo Stripping System", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Stripping", fibres: ["Denim"], apps: ["Laser/Ozone Wash Fading"], approved: false },
  { num: 114, name: "Garment Softener", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Softening", fibres: ["Denim", "Casual Garments"], apps: ["Garment Tumble Finishing"], approved: false },
  { num: 115, name: "Garment Finishing Resin", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "3D Effects", fibres: ["Denim"], apps: ["3D Whisker & Crease Baking"], approved: false },
  { num: 116, name: "Tinting Agent", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Coloration", fibres: ["Denim"], apps: ["Dirty Wash & Vintage Tints"], approved: false },
  { num: 117, name: "Enzyme Stabiliser", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Enzyme Stabilization", fibres: ["Formulation Chemical"], apps: ["Laundry Chemical Blending"], approved: false },
  { num: 118, name: "Enzyme Inhibitor", cat: "Garment & Denim Chemicals", stage: "Garment Washing", func: "Enzyme Deactivation", fibres: ["Cotton Denim"], apps: ["Strength Loss Prevention"], approved: false },

  // 7.10 Coating and Technical Textiles (119-130)
  { num: 119, name: "PU Coating Resin", cat: "Coating & Technical Textiles", stage: "Coating", func: "Coating Polymer", fibres: ["Polyester", "Nylon"], apps: ["Waterproof Breathable Jackets", "Tents"], approved: true },
  { num: 120, name: "Acrylic Coating Polymer", cat: "Coating & Technical Textiles", stage: "Coating", func: "Coating Polymer", fibres: ["Polyester", "Cotton Blends"], apps: ["Blackout Curtains", "Awnings"], approved: false },
  { num: 121, name: "Silicone Coating System", cat: "Coating & Technical Textiles", stage: "Coating", func: "Coating Polymer", fibres: ["Glass Fibre", "Nylon"], apps: ["Airbags", "Architectural Membranes"], approved: false },
  { num: 122, name: "Coating Thickener", cat: "Coating & Technical Textiles", stage: "Coating", func: "Thickening", fibres: ["Coating Compounds"], apps: ["Knife-over-Roll Coating"], approved: false },
  { num: 123, name: "Coating Crosslinker", cat: "Coating & Technical Textiles", stage: "Coating", func: "Crosslinking", fibres: ["Polymer Resins"], apps: ["Coating Wash Durability"], approved: false },
  { num: 124, name: "Coating Catalyst", cat: "Coating & Technical Textiles", stage: "Coating", func: "Catalysis", fibres: ["Polymer Resins"], apps: ["Thermal Curing Ovens"], approved: false },
  { num: 125, name: "Adhesion Promoter", cat: "Coating & Technical Textiles", stage: "Coating", func: "Adhesion", fibres: ["High-Tenacity Polyester", "Nylon"], apps: ["Tarpaulins", "Inflatables"], approved: false },
  { num: 126, name: "Textile Lamination Adhesive", cat: "Coating & Technical Textiles", stage: "Lamination", func: "Adhesion", fibres: ["Membranes", "Fabrics"], apps: ["3-Layer Softshell Laminates"], approved: false },
  { num: 127, name: "PU Lamination Adhesive", cat: "Coating & Technical Textiles", stage: "Lamination", func: "Adhesion", fibres: ["PTFE / TPU Membranes"], apps: ["Medical & Outdoor Laminates"], approved: false },
  { num: 128, name: "Hot-Melt Textile Adhesive", cat: "Coating & Technical Textiles", stage: "Lamination", func: "Adhesion", fibres: ["Apparel Interlinings"], apps: ["Fusible Interlining Bonding"], approved: false },
  { num: 129, name: "Coating Defoamer", cat: "Coating & Technical Textiles", stage: "Coating", func: "Defoaming", fibres: ["Coating Compounds"], apps: ["Pin-Hole Prevention"], approved: false },
  { num: 130, name: "Textile Pigment Dispersion", cat: "Coating & Technical Textiles", stage: "Coating", func: "Coloration", fibres: ["Coating Polymers"], apps: ["Pigmented Coating Pastes"], approved: false },

  // 7.11 Water and Effluent Treatment (131-140)
  { num: 131, name: "ETP Coagulant", cat: "Water & Effluent Treatment", stage: "Effluent Treatment", func: "Coagulation", fibres: ["Textile Wastewater"], apps: ["Mill ETP Primary Clarifiers"], approved: true },
  { num: 132, name: "ETP Flocculant", cat: "Water & Effluent Treatment", stage: "Effluent Treatment", func: "Flocculation", fibres: ["Textile Wastewater"], apps: ["Secondary Clarifiers & Sludge Press"], approved: false },
  { num: 133, name: "Wastewater Decolourising Agent", cat: "Water & Effluent Treatment", stage: "Effluent Treatment", func: "Decolourisation", fibres: ["Dyehouse Wastewater"], apps: ["Reactive & Disperse Dye Removal"], approved: false },
  { num: 134, name: "ETP Defoamer", cat: "Water & Effluent Treatment", stage: "Effluent Treatment", func: "Defoaming", fibres: ["Aeration Tanks"], apps: ["Biological Aeration Froth Suppression"], approved: false },
  { num: 135, name: "pH Correction Chemical", cat: "Water & Effluent Treatment", stage: "Effluent Treatment", func: "pH Neutralisation", fibres: ["Textile Wastewater"], apps: ["Effluent Equalisation Tanks"], approved: false },
  { num: 136, name: "Sludge Conditioner", cat: "Water & Effluent Treatment", stage: "Effluent Treatment", func: "Dewatering", fibres: ["ETP Sludge"], apps: ["Filter Press Dewatering"], approved: false },
  { num: 137, name: "RO Antiscalant", cat: "Water & Effluent Treatment", stage: "Water Treatment", func: "Antiscaling", fibres: ["Process Water"], apps: ["ZLD Reverse Osmosis Plants"], approved: false },
  { num: 138, name: "Membrane Cleaning Chemical", cat: "Water & Effluent Treatment", stage: "Water Treatment", func: "Cleaning", fibres: ["RO Membranes"], apps: ["Acid/Alkali CIP Cleaning Cycles"], approved: false },
  { num: 139, name: "Boiler Water Treatment Chemical", cat: "Water & Effluent Treatment", stage: "Utility Water", func: "Scale/Corrosion Inhibition", fibres: ["Steam Boilers"], apps: ["Steam Generation in Dyehouses"], approved: false },
  { num: 140, name: "Cooling Water Treatment Chemical", cat: "Water & Effluent Treatment", stage: "Utility Water", func: "Biocide / Scale Control", fibres: ["Cooling Towers"], apps: ["Compressor and Chiller Circuits"], approved: false }
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Generate data/textile-product-candidates.json
const productCandidates = rawCandidates.map(c => {
  const id = `CHEM-TEX-${String(c.num).padStart(3, '0')}`;
  const slug = slugify(c.name);
  return {
    id,
    num: c.num,
    slug,
    name: c.name,
    category: c.cat,
    processStages: [c.stage],
    productFunction: c.func,
    applicableFibres: c.fibres,
    fabricApplications: c.apps,
    synonyms: [
      `${c.name} for Textile`,
      `Industrial ${c.name}`,
      `Textile Processing ${c.name}`
    ],
    status: c.approved ? "active" : "review",
    publicationStatus: c.approved ? "approved" : "draft",
    shortDescription: `Commercial chemical auxiliary serving ${c.func.toLowerCase()} requirements in textile ${c.stage.toLowerCase()} operations.`,
    isCandidate: true,
    commercialEnquiryUrl: "https://www.indiamart.com/om-saienterprise-surat/"
  };
});

// Generate data/textile-seo-keywords.json
const seoKeywords = rawCandidates.map(c => {
  const primary = `Textile ${c.name.replace(/^Textile\s+/, '')}`;
  return {
    id: `CHEM-TEX-${String(c.num).padStart(3, '0')}`,
    productName: c.name,
    category: c.cat,
    primaryKeyword: primary,
    secondaryKeywords: [
      `${c.name} for Textile Processing`,
      `${c.func} Agent in Textile Industry`,
      `Textile ${c.stage} Chemicals`,
      `${c.name} Supplier India`
    ],
    searchIntent: "Commercial B2B Investigation & Sourcing",
    suggestedTitle: `${c.name} | Textile ${c.stage} Auxiliaries | Om Sai Enterprise`,
    suggestedMetaDescription: `Understand the technical role, application context, and commercial sourcing parameters for ${c.name} in textile ${c.stage.toLowerCase()} operations.`
  };
});

fs.writeFileSync('data/textile-product-candidates.json', JSON.stringify(productCandidates, null, 2));
fs.writeFileSync('data/textile-seo-keywords.json', JSON.stringify(seoKeywords, null, 2));

console.log(`✓ Generated ${productCandidates.length} product candidates and keyword records.`);
