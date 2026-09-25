import os

path = r"src\auth\auth.service.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('roles: [user.role],', 'roles: [user.role],\n        priorityLevel: user.priorityLevel,')

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
