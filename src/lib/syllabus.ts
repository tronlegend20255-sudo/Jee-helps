export const syllabus: Record<string, Record<string, string[]>> = {
  Physics: {
    "Kinematics": ["Uniform Motion", "Projectile Motion", "Relative Velocity"],
    "Laws of Motion": ["Newton's Laws", "Friction", "Circular Motion"],
    "Work, Energy and Power": ["Work-Energy Theorem", "Conservation of Energy", "Collisions"],
    "Rotational Motion": ["Moment of Inertia", "Torque", "Rolling Motion"],
    "Electrodynamics": ["Coulomb's Law", "Electric Field", "Gauss's Law", "Capacitors", "Current Electricity", "Magnetic Effects of Current"],
    "Modern Physics": ["Photoelectric Effect", "Bohr Model", "Nuclear Physics", "Semiconductors"],
    "Optics": ["Reflection and Refraction", "Lenses", "Interference", "Diffraction"]
  },
  Chemistry: {
    "Physical Chemistry": ["Mole Concept", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Chemical Equilibrium", "Electrochemistry", "Chemical Kinetics"],
    "Organic Chemistry": ["IUPAC Nomenclature", "GOC", "Hydrocarbons", "Haloalkanes", "Alcohols, Phenols and Ethers", "Aldehydes and Ketones", "Amines"],
    "Inorganic Chemistry": ["Periodic Table", "Chemical Bonding", "Coordination Compounds", "s-Block Elements", "p-Block Elements", "d and f Block Elements", "Metallurgy"]
  },
  Mathematics: {
    "Algebra": ["Complex Numbers", "Quadratic Equations", "Matrices and Determinants", "Permutations and Combinations", "Binomial Theorem", "Probability"],
    "Calculus": ["Functions", "Limits and Continuity", "Differentiability", "Application of Derivatives", "Indefinite Integration", "Definite Integration", "Differential Equations"],
    "Coordinate Geometry": ["Straight Lines", "Circles", "Parabola", "Ellipse", "Hyperbola"],
    "Vectors and 3D Geometry": ["Vector Algebra", "3D Lines", "3D Planes"],
    "Trigonometry": ["Trigonometric Ratios", "Trigonometric Equations", "Inverse Trigonometric Functions", "Solution of Triangles"]
  }
};

export const subjects = Object.keys(syllabus);
