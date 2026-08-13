import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
	  try {
	  	    const { fullName, email, password, phoneNumber } = await req.json();

	  	        if (!fullName || !email || !password || !phoneNumber) {
	  	        	      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
	  	        	          }

	  	        	              const existingUser = await prisma.user.findFirst({
	  	        	              	      where: { OR: [{ email }, { phoneNumber }] },
	  	        	              	          });

	  	        	              	              if (existingUser) {
	  	        	              	              	      return NextResponse.json({ error: 'User or phone number already exists' }, { status: 400 });
	  	        	              	              	          }

	  	        	              	              	              const hashedPassword = await bcrypt.hash(password, 10);

	  	        	              	              	                  const user = await prisma.user.create({
	  	        	              	              	                  	      data: {
	  	        	              	              	                  	      	        fullName,
	  	        	              	              	                  	      	                email,
	  	        	              	              	                  	      	                        password: hashedPassword,
	  	        	              	              	                  	      	                                phoneNumber,
	  	        	              	              	                  	      	                                      },
	  	        	              	              	                  	      	                                          });

	  	        	              	              	                  	      	                                              return NextResponse.json({ message: 'User registered successfully!', userId: user.id });
	  	        	              	              	                  	      	                                                } catch (error: any) {
	  	        	              	              	                  	      	                                                	    return NextResponse.json({ error: error.message }, { status: 500 });
	  	        	              	              	                  	      	                                                	      }
	  	        	              	              	                  	      	                                                	      }
	  	        	              	              	                  	      	                                                	      
	  	        	              	              	                  	      	                                                }
	  	        	              	              	                  	      }
	  	        	              	              	                  })
	  	        	              	              }
	  	        	              })
	  	        }
	  }
}
