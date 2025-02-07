// Get featured tours
export const getFeaturedTours = async (req, res) => {
   try {
      const tours = await Tour.find({ featured: true })
         .populate('reviews')
         .limit(8);

      res.status(200).json({
         success: true,
         message: "Successful",
         data: tours
      });
   } catch (err) {
      res.status(404).json({
         success: false,
         message: "Not Found"
      });
   }
}; 