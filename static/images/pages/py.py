import os
n = 1
count = 0
files = []
for n in os.listdir(r"C:\Users\yassinhasan\Desktop\yassin book\\"):
   
    if ( not "thumb" in n ) and (not "py" in n):
        
        files.append(n)
        # count +=1
        # x = cv2.imread(r"C:\Users\yassinhasan\Desktop\yassin book"+"\\"+n)
        # y = cv2.resize(x,(77,100))
        # cv2.imwrite(r"C:\Users\yassinhasan\Desktop\yassin book\\"+f"{count}-thumb.jpg",y)

sorted_files = sorted(files,key=lambda x:  int(x.rsplit('.', 2)[0]))

for y in sorted_files:
    num = y.split(".",2)[0]
    
    os.popen(f"copy {y} {num}-large.jpg")