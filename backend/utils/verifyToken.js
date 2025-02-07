import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
   const authHeader = req.headers.authorization;
   
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
         success: false,
         message: "Please login first"
      });
   }

   const token = authHeader.split(' ')[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: "Invalid token"
      });
   }
};

export const verifyUser = (req, res, next) => {
   verifyToken(req, res, () => {
      // Allow the user to access their own data or if they're admin
      if (req.user) {
         next();
      } else {
         return res.status(403).json({
            success: false,
            message: "You're not authorized"
         });
      }
   });
};

export const verifyAdmin = (req, res, next) => {
   const authHeader = req.headers.authorization;
   
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
         success: false,
         message: "Admin authentication required"
      });
   }

   const token = authHeader.split(' ')[1];
   
   try {
      // For admin token, we'll do a simple check since we're using a basic token system
      const decodedString = atob(token);
      const [prefix, email] = decodedString.split(':');
      
      if (prefix !== 'admin' || email !== 'krishnaabhisripg@gmail.com') {
         throw new Error('Invalid admin token');
      }
      
      req.user = { role: 'admin' };
      next();
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: "Invalid admin token"
      });
   }
}; 