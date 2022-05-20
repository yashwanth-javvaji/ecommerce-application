For connecting to ec2

Give only permissons to user
sudo chmod 600 /path/to/my/key.pem

--
create ansible.cfg file
add path of private.pem file

https://www.youtube.com/watch?v=Wr8zAU-0uR4&t=1008s&ab_channel=TechwithNana

CMD
ansible all -i hosts -u ec2-user -m ping 


https://stackabuse.com/how-to-fix-warning-unprotected-private-key-file-on-mac-and-linux/

ALSO
sudo chown -v $USER ~/.ssh/known_hosts



FINAL EX COMMANDS
ansible all -i hosts -u ec2-user -m ping 

===

For ec2_create.yml ... create keypair (pem) in aws and update file
#create keypair in us-east-1
#create ~/.boto file
#https://www.youtube.com/watch?v=2_GXHygzWSQ&t=487s&ab_channel=TechArkit


https://github.com/ansible/ansible/blob/stable-2.9/examples/ansible.cfg
https://superuser.com/questions/975319/can-t-find-the-config-file-in-etc-ansible-on-mac-os-x
https://docs.ansible.com/ansible/latest/user_guide/connection_details.html#:~:text=vars%3A%20ansible_user%3A%20admin-,Setting%20up%20SSH%20keys,%2D%2Dask%2Dbecome%2Dpass%20.




kubectl get events
